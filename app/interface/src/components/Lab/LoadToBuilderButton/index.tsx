import React from "react";
import { FaTools, FaUps } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ButtonVariant, Lab } from "../../../dataStructures";
import { useActionStatus } from "../../../hooks/useActionStatus";
import { useSetLab } from "../../../hooks/useLab";
import { useSetLogs } from "../../../hooks/useLogs";
import { usePreference } from "../../../hooks/usePreference";
import Button from "../../Button";

type Props = {
  variant: ButtonVariant;
  children: React.ReactNode;
  lab: Lab | undefined;
};

export default function LoadToBuilderButton({ variant, children, lab }: Props) {
  const { mutate: setLogs } = useSetLogs();
  const { mutate: setLab } = useSetLab();
  const { data: inProgress } = useActionStatus();
  const { data: preference } = usePreference();
  const navigate = useNavigate();

  function onClickHandler() {
    if (lab !== undefined) {
      // Apply Preference
      if (lab.template !== undefined && preference !== undefined) {
        lab.template.resourceGroup.location = preference.azureRegion;
      }

      // Update logs only if no action is in progress.
      if (!inProgress) {
        setLogs({
          isStreaming: false,
          logs: JSON.stringify(lab.template, null, 4),
        });
      }

      // Set lab and navigate to builder.
      setLab(lab);
      navigate("/builder");
    }
  }

  return (
    <Button
      variant={variant}
      onClick={onClickHandler}
      disabled={lab === undefined}
    >
      <span>
        <FaTools />
      </span>
      {children}
    </Button>
  );
}
