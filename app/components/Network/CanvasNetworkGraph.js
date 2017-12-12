import { findDOMNode } from 'react-dom'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
// import './CanvasNetworkGraph.css'

function generateSimulationData(nodes, edges) {
  const resNodes = nodes.map(node => Object.assign(node, { id: node.pub_key }))
  const resEdges = edges.map(node => Object.assign(node, { source: node.node1_pub, target: node.node2_pub }))

  return {
    nodes: resNodes,
    links: resEdges
  }
}

class CanvasNetworkGraph extends Component {
  constructor(props) {
    super(props)

    this.state = {
      width: 800,
      height: 800,

      simulation: {},
      simulationData: {
        nodes: [],
        links: []
      }
    }

    this._startSimulation = this._startSimulation.bind(this)
    this._zoomActions = this._zoomActions.bind(this)
    this._ticked = this._ticked.bind(this)
    this._restart = this._restart.bind(this)
  }

  componentDidMount() {
    // wait for the svg to me in the DOM before we start the simulation
    const svgInterval = setInterval(() => {
      if (document.getElementById('map')) {
        this._startSimulation()

        clearInterval(svgInterval)
      }
    }, 1000)
  }

  componentDidUpdate(prevProps, prevState) {
    const { 
      network: { nodes, edges },
      selectedPeerPubkeys,
      selectedChannelIds,
      currentRouteChanIds
    } = this.props

    const prevNodes = prevProps.network.nodes
    const prevEdges = prevProps.network.edges

    // update the simulationData only if the nodes or edges have changed
    if (prevNodes.length !== nodes.length || prevEdges.length !== edges.length) {
      this.setState({
        simulationData: generateSimulationData(nodes, edges)
      })
    }

    if (prevProps.selectedPeerPubkeys.length !== selectedPeerPubkeys.length) {
      this._updateSelectedPeers()
    }

    if (prevProps.selectedChannelIds.length !== selectedChannelIds.length) {
      this._updateSelectedChannels()
    }

    if (prevProps.currentRouteChanIds.length !== currentRouteChanIds.length) {
      this._renderSelectedRoute()
    }
  }

  componentWillUnmount() {
    d3.select('#map')
      .selectAll('*')
      .remove()
  }

  _updateSelectedPeers() {
    const { selectedPeerPubkeys } = this.props

    // remove active class
    d3.selectAll('.active-peer')
      .each(function(d) {
        d3.select(this).classed('active-peer', false)
      })
    
    // add active class to all selected peers
    selectedPeerPubkeys.forEach(pubkey => {
      const node = d3.select(`#node-${pubkey}`).classed('active-peer', true)
    })
  }

  _updateSelectedChannels() {
    const { selectedChannelIds } = this.props

    // remove active class
    d3.selectAll('.active-channel')
      .each(function(d) {
        d3.select(this).classed('active-channel', false)
      })
    
    // add active class to all selected peers
    selectedChannelIds.forEach(chanid => {
      const node = d3.select(`#link-${chanid}`).classed('active-channel', true)
    })
  }

  _renderSelectedRoute() {
    const { currentRouteChanIds } = this.props

    // remove all route animations before rendering new ones
    d3.selectAll('.animated-route-circle')
      .each(function(d) {
        d3.select(this).remove()
      })

    currentRouteChanIds.forEach(chanId => {
      const link = document.getElementById(`link-${chanId}`)

      if (!link) { return }
      const x1 = link.x1.baseVal.value
      const x2 = link.x2.baseVal.value
      const y1 = link.y1.baseVal.value
      const y2 = link.y2.baseVal.value

      // create the circle that represent btc traveling through a channel
      const circle = this.g
        .append('circle')
        .attr('id', `circle-${chanId}`)
        .attr('class', 'animated-route-circle')
        .attr('r', 50)
        .attr('cx', x1)
        .attr('cy', y1)
        .attr('fill', '#FFDC53')

      // we want the animation to repeat back and forth, this function executes that visually
      const repeat = () => {
        d3.select(`#circle-${chanId}`)
          .transition()
          .attr('cx', x2 )
          .attr('cy', y2 )
          .duration(1000)
          .transition()        
          .duration(1000)      
          .attr('cx', x1) 
          .attr('cy', y1) 
          .on('end', repeat)
      }

      // call repeat to animate the circle
      repeat()
    })
  }

  _startSimulation() {
    const { simulationData: { nodes, links } } = this.state

    // grab the svg el along with the attributes
    const svg = d3.select('#map'),
      width = +svg.attr('width'),
      height = +svg.attr('height')

    this.g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)
    this.link = this.g.append('g').attr('stroke', 'white').attr('stroke-width', 1.5).selectAll('.link')
    this.node = this.g.append('g').attr('stroke', 'silver').attr('stroke-width', 1.5).selectAll('.node')

    this.simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-750))
      .force('link', d3.forceLink(links).id(d => d.pub_key).distance(500))
      .force('collide', d3.forceCollide(300))
      .on('tick', this._ticked)

    // zoom
    const zoom_handler = d3.zoom().on('zoom', this._zoomActions)
    zoom_handler(svg)

    this._restart()
  }

  _zoomActions() {
    this.g.attr('transform', d3.event.transform)
  }

  _ticked() {
    this.node.attr('cx', d => d.x)
      .attr('cy', d => d.y)

    this.link.attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
  }

  _restart() {
    const { identity_pubkey } = this.props
    const {
      simulation,
      simulationData: { nodes, links }
    } = this.state

    // Apply the general update pattern to the nodes.
    this.node = this.node.data(nodes, d => d.pub_key)
    this.node.exit().remove()
    this.node = this.node.enter()
                .append('circle')
                .attr('stroke', d => 'silver')
                .attr('fill', d => d.pub_key === identity_pubkey ? '#FFF' : '#353535')
                .attr('r', d => 100)
                .attr('id', d => `node-${d.pub_key}`)
                .attr('class', 'network-node')
                .merge(this.node)

    // Apply the general update pattern to the links.
    this.link = this.link.data(links, d => `${d.source.id}-${d.target.id}`)
    this.link.exit().remove()
    this.link = 
      this.link.enter()
      .append('line')
      .attr('id', d => `link-${d.channel_id}`)
      .attr('class','network-link')
      .merge(this.link)

    // Update and restart the simulation.
    this.simulation.nodes(nodes)
    this.simulation.force('link').links(links)
    this.simulation.restart()
  }

  render() {
    const { simulationData } = this.state
    const {
      network: { nodes, edges, selectedChannel, networkLoading },
      selectedPeerPubkeys,
      selectedChannelIds,
      currentRouteChanIds,
      identity_pubkey
    } = this.props

    return (
      <div id='mapContainer' style={{ display: 'inline' }}>
        <svg width='800' height='800' id='map'></svg>
      </div>
    )
  }
}

CanvasNetworkGraph.propTypes = {
  network: PropTypes.object.isRequired
}

export default CanvasNetworkGraph