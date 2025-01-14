import { useState } from "react";
import { FaChevronDown, FaTrash } from "react-icons/fa";
import {
  useActionStatus,
  useSetActionStatus,
} from "../../hooks/useActionStatus";
import {
  useAddWorkspace,
  useDeleteWorkspace,
  useGetResources,
  useSelectWorkspace,
  useTerraformWorkspace,
} from "../../hooks/useWorkspace";
import SettingsItemLayout from "../../layouts/SettingsItemLayout";
import Button from "../Button";
import TfResources from "../TfResources";

type TfWorkspaceProps = {
  workspaceMenu: boolean;
  setWorkspaceMenu(args: boolean): void;
};

export default function TfWorkspace({
  workspaceMenu,
  setWorkspaceMenu,
}: TfWorkspaceProps) {
  const [add, setAdd] = useState<boolean>(false);
  const [newWorkSpaceName, setNewWorkSpaceName] = useState<string>("");
  const {
    data: workspaces,
    refetch: refetchWorkspaces,
    isLoading: gettingWorkspaces,
    isFetching: fetchingWorkspaces,
    isError: workspaceError,
  } = useTerraformWorkspace();
  const { isFetching: fetchingResources } = useGetResources();
  const { mutate: selectWorkspace, isLoading: selectingWorkspace } =
    useSelectWorkspace();
  const { isLoading: deletingWorkspace } = useDeleteWorkspace();
  const { mutate: addWorkspace, isLoading: addingWorkspace } =
    useAddWorkspace();
  const { data: actionStatus } = useActionStatus();
  const { mutate: setActionStatus } = useSetActionStatus();

  function handleAddWorkspace(event: React.ChangeEvent<HTMLInputElement>) {
    setNewWorkSpaceName(event.target.value);
  }

  return (
    <SettingsItemLayout>
      <div className="flex flex-col gap-y-2">
        <div className="flex justify-between py-2">
          <div>
            <h2 className="text-lg">Terraform Workspaces</h2>
          </div>
          <div className="flex flex-col gap-y-2">
            <div
              className="flex w-full justify-between gap-x-4"
              onDoubleClick={() => refetchWorkspaces}
            >
              <div className="relative inline-block text-left">
                <div
                  className={` ${add && "hidden"} ${
                    (actionStatus ||
                      gettingWorkspaces ||
                      selectingWorkspace ||
                      deletingWorkspace ||
                      addingWorkspace ||
                      fetchingWorkspaces ||
                      fetchingResources) &&
                    "text-slate-500"
                  } flex w-96 items-center justify-between rounded border border-slate-500 p-2`}
                  onClick={(e) => {
                    if (
                      !(
                        actionStatus ||
                        gettingWorkspaces ||
                        selectingWorkspace ||
                        deletingWorkspace ||
                        addingWorkspace ||
                        fetchingWorkspaces ||
                        fetchingResources
                      )
                    ) {
                      setWorkspaceMenu(!workspaceMenu);
                    }
                    e.stopPropagation();
                  }}
                >
                  {" "}
                  {workspaceError ? (
                    <p>default</p>
                  ) : (
                    <>
                      {gettingWorkspaces ||
                      selectingWorkspace ||
                      deletingWorkspace ||
                      addingWorkspace ||
                      fetchingWorkspaces ||
                      fetchingResources ? (
                        <p>Please wait...</p>
                      ) : (
                        <>
                          {workspaces?.map(
                            (workspace) =>
                              workspace.selected && (
                                <p key={workspace.name}>{workspace.name}</p>
                              )
                          )}
                        </>
                      )}
                    </>
                  )}
                  <p>
                    <FaChevronDown />
                  </p>
                </div>
                <div
                  className={`${
                    !add && "hidden"
                  } flex w-96 items-center justify-between rounded border border-slate-500`}
                >
                  <input
                    type="text"
                    className="block h-10 w-full bg-inherit px-2 text-inherit"
                    placeholder="Name your new workspace."
                    value={newWorkSpaceName}
                    onChange={handleAddWorkspace}
                  ></input>
                </div>
                <div
                  className={`absolute right-0 mt-2 h-56 w-96 origin-top-right overflow-y-auto scrollbar overflow-x-hidden ${
                    !workspaceMenu && "hidden"
                  } items-center gap-y-2 rounded border border-slate-500 bg-slate-100 p-2 dark:bg-slate-800`}
                >
                  {workspaces?.map(
                    (workspace) =>
                      !workspace.selected && (
                        <div className="flex justify-between gap-x-1">
                          <div
                            className="w-full items-center rounded p-2 hover:bg-sky-500 hover:text-slate-100 "
                            onClick={() => {
                              setActionStatus({ inProgress: true });
                              selectWorkspace(workspace);
                            }}
                          >
                            {workspace.name}
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
              {add ? (
                <>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setAdd(!add);
                      setNewWorkSpaceName("");
                    }}
                  >
                    Nah
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => {
                      addWorkspace({ name: newWorkSpaceName, selected: true });
                      setAdd(!add);
                      setNewWorkSpaceName("");
                    }}
                  >
                    Add
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary-outline"
                  disabled={
                    actionStatus ||
                    gettingWorkspaces ||
                    selectingWorkspace ||
                    deletingWorkspace ||
                    addingWorkspace ||
                    fetchingWorkspaces ||
                    fetchingResources
                  }
                  onClick={() => {
                    setAdd(!add);
                    setNewWorkSpaceName("");
                  }}
                >
                  Add Workspace
                </Button>
              )}
            </div>
            <div className="flex justify-end">
              <TfResources />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-slate-700 dark:text-slate-300">
            - If you see no workspaces listed. Thats probably becaue terraform
            is not yet initialized. This will populate once terraform is
            initialized.
          </p>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            - Deleting a workspace also destroys all resources in the workspace.
          </p>
        </div>
      </div>
    </SettingsItemLayout>
  );
}
