export function processFormConfig(config = {}) {
  const { nodes, edges, groups } = config;
  const validationMap = {};

  const nodeMap = nodes.reduce((nodeMap, node) => {
    const { id, required, regex } = node;
    nodeMap[node.id] = node;
    if (regex) {
      let regExp = new RegExp(regex);
      validationMap[id] = (val) =>
        val
          ? regExp.test(val)
            ? null
            : "Invalid Input"
          : required && "Required Field";
    } else if (required) {
      validationMap[id] = (val) => (val ? null : "Required Field");
    }
    return nodeMap;
  }, {});

  const groupMap = groups.reduce((groupMap, group) => {
    groupMap[group.id] = { ...group, nodes: [] };
    return groupMap;
  }, {});

  const nodeDependencyMap = {};
  const nodeToGroupMap = {};
  const dependentNodesMap = {};
  edges.forEach(({ from, to, condition = [{}] }) => {
    const { value = "" } = condition[0];
    if (groupMap[from]) {
      nodeToGroupMap[to] = groupMap[from];
    } else {
      if (value) {
        dependentNodesMap[to] = true;
      }
      if (!nodeDependencyMap[`${from}_${value}`]) {
        nodeDependencyMap[`${from}_${value}`] = [nodeMap[to]];
      } else {
        nodeDependencyMap[`${from}_${value}`].push(nodeMap[to]);
      }
    }
  });

  return {
    groups: getRenderGroups({
      nodes,
      dependentNodesMap,
      nodeToGroupMap,
      nodeDependencyMap
    }),
    validate: validationMap
  };
}

function getRenderGroups({
  nodes,
  dependentNodesMap = {},
  nodeToGroupMap,
  nodeDependencyMap
}) {
  const renderGroups = [];
  const groupToIndexMap = {};
  nodes.forEach((node) => {
    if (!dependentNodesMap[node.id]) {
      const group = nodeToGroupMap[node.id] || {
        id: renderGroups.length,
        nodes: []
      };
      if (!groupToIndexMap[group.id]) {
        groupToIndexMap[group.id] = `${renderGroups.length}`;
        renderGroups.push(group);
      }
      group.nodes.push(node);
      if (node.subType === "OPTIONS") {
        node.options.forEach((option) => {
          const childNodes = nodeDependencyMap[`${node.id}_${option.value}`];
          if (childNodes) {
            option.renderGroups = getRenderGroups({
              nodes: childNodes,
              nodeToGroupMap,
              nodeDependencyMap
            });
          }
        });
      }
    }
  });
  return renderGroups;
}
