import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as d3Force from 'd3-force';
import * as d3Selection from 'd3-selection';
import * as d3Zoom from 'd3-zoom';
const d3 = Object.assign({}, d3Force, d3Selection, d3Zoom)
import styles from './CanvasNetworkGraph.scss'

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
      simulation: {},
      simulationData: {
        nodes: [],
        links: []
      },

      svgLoaded: false
    }

    this.startSimulation = this.startSimulation.bind(this)
    this.zoomActions = this.zoomActions.bind(this)
    this.ticked = this.ticked.bind(this)
    this.restart = this.restart.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { network } = nextProps
    const { simulationData: { nodes, links } } = this.state

    const simulationDataEmpty = !nodes.length && !links.length
    const networkDataLoaded = network.nodes.length || network.edges.length

    // if the simulationData is empty and we have network data
    if (simulationDataEmpty && networkDataLoaded) {
      this.setState({
        simulationData: generateSimulationData(network.nodes, network.edges)
      })
    }
  }

  componentDidMount() {
    // wait for the svg to be in the DOM before we start the simulation
    const svgInterval = setInterval(() => {
      if (document.getElementById('mapContainer')) {
        d3.select('#mapContainer')
          .append('svg')
          .attr('id', 'map')
          .attr('width', '100%')
          .attr('height', '100%')

        this.startSimulation()

        clearInterval(svgInterval)
      }
    }, 1000)
  }

  componentDidUpdate(prevProps) {
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
      this.updateSelectedPeers()
    }

    if (prevProps.selectedChannelIds.length !== selectedChannelIds.length) {
      this.updateSelectedChannels()
    }

    if (prevProps.currentRouteChanIds.length !== currentRouteChanIds.length) {
      this.renderSelectedRoute()
    }
  }

  componentWillUnmount() {
    d3.select('#map')
      .remove()
  }

  updateSelectedPeers() {
    const { selectedPeerPubkeys } = this.props

    // remove active class
    d3.selectAll('.active-peer')
      .each(function () {
        d3.select(this).classed('active-peer', false)
      })

    // add active class to all selected peers
    selectedPeerPubkeys.forEach((pubkey) => {
      d3.select(`#node-${pubkey}`).classed('active-peer', true)
    })
  }

  updateSelectedChannels() {
    const { selectedChannelIds } = this.props

    // remove active class
    d3.selectAll('.active-channel')
      .each(function () {
        d3.select(this).classed('active-channel', false)
      })

    // add active class to all selected peers
    selectedChannelIds.forEach((chanid) => {
      d3.select(`#link-${chanid}`).classed('active-channel', true)
    })
  }

  renderSelectedRoute() {
    const { currentRouteChanIds } = this.props

    // remove all route animations before rendering new ones
    d3.selectAll('.animated-route-circle')
      .each(function () {
        d3.select(this).remove()
      })

    currentRouteChanIds.forEach((chanId) => {
      const link = document.getElementById(`link-${chanId}`)

      if (!link) { return }
      const x1 = link.x1.baseVal.value
      const x2 = link.x2.baseVal.value
      const y1 = link.y1.baseVal.value
      const y2 = link.y2.baseVal.value

      // create the circle that represent btc traveling through a channel
      this.g
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
          .attr('cx', x2)
          .attr('cy', y2)
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

  startSimulation() {
    const { simulationData: { nodes, links } } = this.state

    // grab the svg el along with the attributes
    const svg = d3.select('#map')
    const svgBox = svg.node().getBBox()

    this.g = svg.append('g').attr('transform', `translate(${svgBox.width / 2},${svgBox.height / 2})`)
    this.link = this.g.append('g').attr('stroke', 'white').attr('stroke-width', 1.5).selectAll('.link')
    this.node = this.g.append('g').attr('stroke', 'silver').attr('stroke-width', 1.5).selectAll('.node')

    this.simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-750))
      .force('link', d3.forceLink(links).id(d => d.pub_key).distance(500))
      .force('collide', d3.forceCollide(300))
      .on('tick', this.ticked)
      .on('end', () => {
        this.setState({ svgLoaded: true })
      })
    // zoom
    const zoom_handler = d3.zoom().on('zoom', this.zoomActions)
    zoom_handler(svg)

    this.restart()
  }

  zoomActions() {
    this.g.attr('transform', d3Selection.event.transform)
  }

  ticked() {
    this.node.attr('cx', d => d.x)
      .attr('cy', d => d.y)

    this.link.attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
  }

  restart() {
    const { identity_pubkey } = this.props
    const { simulationData: { nodes, links } } = this.state

    // Apply the general update pattern to the nodes.
    this.node = this.node.data(nodes, d => d.pub_key)
    this.node.exit().remove()
    this.node = this.node.enter()
      .append('circle')
      .attr('stroke', () => 'silver')
      .attr('fill', d => d.pub_key === identity_pubkey ? '#FFF' : '#353535')
      .attr('r', () => 100)
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
        .attr('class', 'network-link')
        .merge(this.link)

    // Update and restart the simulation.
    this.simulation.nodes(nodes)
    this.simulation.force('link').links(links)
    this.simulation.restart()
  }

  render() {
    const { svgLoaded } = this.state

    return (
      <div className={styles.mapContainer} id='mapContainer'>
        {
          !svgLoaded &&
          <div className={styles.loadingContainer}>
            <div className={styles.loadingWrap}>
              <div className={styles.loader} />
              <div className={styles.loaderbefore} />
              <div className={styles.circular} />
              <div className={`${styles.circular} ${styles.another}`} />
              <div className={styles.text}>loading</div>
            </div>
          </div>
        }
      </div>
    )
  }
}

CanvasNetworkGraph.propTypes = {
  identity_pubkey: PropTypes.string.isRequired,

  network: PropTypes.object.isRequired,

  selectedPeerPubkeys: PropTypes.array.isRequired,
  selectedChannelIds: PropTypes.array.isRequired,
  currentRouteChanIds: PropTypes.array.isRequired
}

export default CanvasNetworkGraph
