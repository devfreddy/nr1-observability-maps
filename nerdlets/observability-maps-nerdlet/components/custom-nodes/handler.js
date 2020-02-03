import React from 'react';
import DefaultNode from './default';

export default class NodeHandler extends React.PureComponent {
  render() {
    const {
      sidebarOpen,
      node,
      mapData,
      nodeSize,
      setParentState,
      closeCharts
    } = this.props;
    return (
      <DefaultNode
        sidebarOpen={sidebarOpen}
        node={node}
        mapData={mapData}
        nodeSize={nodeSize}
        setParentState={setParentState}
        closeCharts={closeCharts}
      />
    );
  }
}
