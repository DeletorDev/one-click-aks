import { TfvarConfigType } from "../../dataStructures";
import { useActionStatus } from "../../hooks/useActionStatus";
import { useLab, useSetLab } from "../../hooks/useLab";
import { useSetLogs } from "../../hooks/useLogs";
import { useSetTfvar, useTfvar } from "../../hooks/useTfvar";
import Checkbox from "../Checkbox";
import { defaultTfvarConfig } from "./defaults";

export default function CustomVnet() {
  const { data: tfvar, isLoading } = useTfvar();
  const { mutate: setTfvar } = useSetTfvar();
  const {
    data: lab,
    isLoading: labIsLoading,
    isFetching: labIsFetching,
  } = useLab();
  const { mutate: setLab } = useSetLab();
  const { data: inProgress } = useActionStatus();
  const { mutate: setLogs } = useSetLogs();

  function handleOnChange() {
    if (lab !== undefined) {
      if (lab.template !== undefined) {
        if (lab.template.virtualNetworks.length === 0) {
          lab.template.virtualNetworks = defaultTfvarConfig.virtualNetworks;
          lab.template.subnets = defaultTfvarConfig.subnets;
          lab.template.networkSecurityGroups =
            defaultTfvarConfig.networkSecurityGroups;
        } else {
          lab.template.virtualNetworks = [];
          lab.template.subnets = [];
          lab.template.networkSecurityGroups = [];
          lab.template.jumpservers = [];
          lab.template.firewalls = [];
          lab.template.kubernetesCluster.privateClusterEnabled = "false";
          lab.template.kubernetesCluster.outboundType = "loadBalancer";
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

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <>
      {lab && lab.template && (
        <Checkbox
          id="toggle-customvnet"
          label="Custom VNET"
          checked={lab.template.virtualNetworks.length > 0}
          disabled={false}
          handleOnChange={handleOnChange}
        />
      )}
    </>
  );
}
