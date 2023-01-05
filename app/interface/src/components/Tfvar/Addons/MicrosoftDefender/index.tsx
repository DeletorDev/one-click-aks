import { useActionStatus } from "../../../../hooks/useActionStatus";
import { useLab, useSetLab } from "../../../../hooks/useLab";
import { useSetLogs } from "../../../../hooks/useLogs";
import Checkbox from "../../../Checkbox";

type Props = {};

export default function MicrosoftDefender({}: Props) {
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
        if (lab.template.kubernetesCluster.addons.microsoftDefender) {
          lab.template.kubernetesCluster.addons.microsoftDefender = false;
        } else {
          lab.template.kubernetesCluster.addons.microsoftDefender = true;
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

  // Reset to empty if not found. This probably ensures backward compatibility.
  if (
    lab.template.kubernetesCluster.addons.microsoftDefender === null ||
    lab.template.kubernetesCluster.addons.microsoftDefender === undefined
  ) {
    lab.template.kubernetesCluster.addons.microsoftDefender = false;
  }

  // If still loading then display disabled flag.
  if (labIsLoading || labIsFetching) {
    return (
      <Checkbox
        id="toggle-defender"
        label="Defender"
        disabled={true}
        checked={false}
        handleOnChange={handleOnChange}
      />
    );
  }

  // Checked conditions
  var checked: boolean = true;
  if (
    lab &&
    lab.template &&
    lab.template.kubernetesCluster &&
    lab.template.kubernetesCluster.addons &&
    lab.template.kubernetesCluster.addons.microsoftDefender === false
  ) {
    checked = false;
  }

  // Disabled Conditions
  var disabled: boolean = false;
  if (labIsLoading || labIsFetching) {
    disabled = true;
  }

  return (
    <>
      {lab && lab.template && (
        <Checkbox
          id="toggle-defender"
          label="Defender (Addon)"
          checked={checked}
          disabled={disabled}
          handleOnChange={handleOnChange}
        />
      )}
    </>
  );
}