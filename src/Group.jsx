import FieldWrapper from "./FieldWrapper";

function Group({ group, form }) {
  const { nodes, label } = group;
  return (
    <div className={`GroupWrapper ${label && "WithLabel"}`}>
      {label && <div className={"Label"}>{label}</div>}
      <div className={"Group"}>
        {nodes.map((fieldData) => (
          <FieldWrapper key={fieldData.id} fieldData={fieldData} form={form} />
        ))}
      </div>
    </div>
  );
}
export default Group;
