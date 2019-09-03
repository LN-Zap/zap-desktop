export {
  Provider,
  connectAdvanced,
  ReactReduxContext,
  batch,
  useDispatch,
  useSelector,
  useStore,
  shallowEqual,
} from '../node_modules/react-redux' // full import path to avoid circular dep
import { connect as originalConnect } from '../node_modules/react-redux'

function defaultMergeProps(stateProps, dispatchProps, ownProps) {
  return { ...stateProps, ...dispatchProps, ...ownProps }
}

/**
 * connect - Patches redux connect function to use `defaultMergeProps` that prioritizes `ownProps` over `stateProps`.
 *
 * @param {*} mapStateToProps mapStateToProps
 * @param {*} mapDispatchToProps mapDispatchToProps
 * @param {*} [mergeProps=defaultMergeProps] mergeProps
 * @param {*} rest options
 * @returns {*}
 */
export function connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps = defaultMergeProps,
  ...rest
) {
  return originalConnect(mapStateToProps, mapDispatchToProps, mergeProps, ...rest)
}
