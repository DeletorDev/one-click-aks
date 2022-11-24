import { Button, Table } from "react-bootstrap";
import { BlobType } from "../dataStructures";
import { useActionStatus, useSetActionStatus } from "../hooks/useActionStatus";
import { useSharedLabs } from "../hooks/useBlobs";
import { useSetLogs } from "../hooks/useLogs";
import { axiosInstance } from "../utils/axios-interceptors";

export default function Learning() {
    const { data: inProgress } = useActionStatus();
    const { mutate: setActionStatus } = useSetActionStatus();
    const { mutate: setLogs } = useSetLogs();
    const { data: blobs } = useSharedLabs();

    function deployHandler(blob: BlobType) {
        setActionStatus({ inProgress: true });
        setLogs({ isStreaming: true, logs: "" });
        axiosInstance.post("deploylab", blob);
    }

    //This function is called after deployHandler streaming ends.
    function breakHandler(blob: BlobType) {
        setActionStatus({ inProgress: true });
        setLogs({ isStreaming: true, logs: "" });
        axiosInstance.post("breaklab", blob);
    }

    function validateHandler(blob: BlobType) {
        setActionStatus({ inProgress: true });
        setLogs({ isStreaming: true, logs: "" });
        axiosInstance.post("validatelab", blob);
    }

    function destroyHandler(blob: BlobType) {
        setActionStatus({ inProgress: true });
        setLogs({ isStreaming: true, logs: "" });
        axiosInstance.post("destroy", blob);
    }

    return (
        <>
            {blobs && (
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Lab Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blobs.map((blob: any) => (
                            <tr key={blob.name}>
                                <td>{blob.name}</td>
                                <td>
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={() => deployHandler(blob)}
                                        disabled={inProgress}
                                    >
                                        Deploy
                                    </Button>{" "}
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={() => breakHandler(blob)}
                                        disabled={inProgress}
                                    >
                                        Break
                                    </Button>{" "}
                                    <Button
                                        size="sm"
                                        variant="outline-success"
                                        onClick={() => validateHandler(blob)}
                                        disabled={inProgress}
                                    >
                                        Validate
                                    </Button>{" "}
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() => destroyHandler(blob)}
                                        disabled={inProgress}
                                    >
                                        Destroy
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
}
