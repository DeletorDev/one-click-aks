import { useActionStatus } from "../../hooks/useActionStatus";
import { useLab, useSetLab } from "../../hooks/useLab";
import { useSetLogs } from "../../hooks/useLogs";
import Checkbox from "../Checkbox";

export default function UserDefinedRouting() {
  const { data: inProgress } = useActionStatus();
  const { mutate: setLogs } = useSetLogs();
  const {
    data: lab,
    isLoading: labIsLoading,
    isFetching: labIsFetching,
  } = useLab();
  const { mutate: setLab } = useSetLab();

  function handleOnChange() {
    if (lab !== undefined) {
      if (lab.template !== undefined) {
        if (
          lab.template.kubernetesClusters.length > 0 &&
          lab.template.kubernetesClusters[0].outboundType ===
            "userDefinedRouting"
        ) {
          lab.template.kubernetesClusters[0].outboundType = "loadBalancer";
        } else {
          lab.template.kubernetesClusters[0].outboundType =
            "userDefinedRouting";
        }
        !inProgress &&
          setLogs({
            isStreaming: false,
            logs: JSON.stringify(lab.template, null, 4),
          });
        setLab(lab);
      }
    }
  }

  if (lab === undefined || lab.template === undefined) {
    return <></>;
  }

  if (labIsLoading || labIsFetching) {
    return (
      <Checkbox
        id="toggle-udr"
        label="UDR"
        disabled={true}
        checked={false}
        handleOnChange={handleOnChange}
      />
    );
  }

  var checked: boolean = false;
  if (
    lab &&
    lab.template &&
    lab.template.kubernetesClusters &&
    lab.template.kubernetesClusters.length > 0 &&
    lab.template.kubernetesClusters[0].outboundType === "userDefinedRouting"
  ) {
    checked = true;
  }

  var disabled: boolean = false;
  if (
    (lab && lab.template && lab.template.virtualNetworks.length === 0) ||
    lab.template.kubernetesClusters.length === 0 ||
    lab.template.firewalls.length === 0 ||
    labIsLoading ||
    labIsFetching
  ) {
    disabled = true;
  }

  return (
    <>
      {lab && lab.template && (
        <Checkbox
          id="toggle-udr"
          label="UDR"
          checked={checked}
          disabled={disabled}
          handleOnChange={handleOnChange}
        />
      )}
    </>
  );
}
