import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import api from "../http/api";
import { Session } from "../prisma/generated/client";

interface Props {}

type SessionStatusT = {
    qrcode: string | null;
    status: string | null;
};

type SessionStatus = Session & SessionStatusT;

const Connect: NextPage<Props> = ({}) => {
    const [session, setSession] = useState<Session[] | undefined>();
    const [sessionStatus, setSessionStatus] = useState<SessionStatus[] | undefined>();
    console.log(sessionStatus);
    useEffect(() => {
        axios.get("/api/session").then((result) => {
            setSession(result.data);
            setSessionStatus(result.data);
        });
    }, []);

    const getSession = async () => {
        await axios.get("/api/session").then((result) => {
            setSession(result.data);
        });
    };

    const createSession = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let values = Object.fromEntries(new FormData(event.currentTarget).entries());
        await api.post(`${values.session}/${process.env.NEXT_PUBLIC_SECRET_KEY}/generate-token`).then(async (result) => {
            await axios.post("/api/session", { name: values.session, token: result.data.token });
        });
        getSession();
    };

    const deleteSession = async (id: string) => {
        await axios.delete("/api/session", { data: { id } }).then((result) => {
            setSession(result.data);
        });
    };
    const connectSession = async (sessionName: string, token: string) => {
        await api.post(`${sessionName}/start-session`, {}, { headers: { Authorization: `Bearer ${token}` } }).then((result) => {
            let index = sessionStatus?.findIndex(({ name }) => name === sessionName);
            setSessionStatus(
                sessionStatus?.map((sessionObj) => {
                    if (sessionObj.name === sessionName) {
                        return { ...sessionObj, status: result.data.status, qrcode: result.data.qrcode };
                    } else {
                        return { ...sessionObj };
                    }
                })
            );
        });
    };

    return (
        <div className="flex flex-col p-3">
            <form onSubmit={createSession}>
                <label className="label">Session:</label>
                <input className="max-w-[128px] mr-4 input input-bordered" type={"text"} name="session" />
                <button className="btn" type="submit">
                    Criar
                </button>
            </form>
            <div className="flex flex-row mt-2">
                {session?.map((sessionValue, index) => (
                    <div className="card w-96 bg-neutral text-neutral-content mx-2" key={sessionValue.id}>
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">{sessionValue.name}</h2>
                            <div className="mt-2">
                                {sessionStatus[index].status === "QRCODE" ? (
                                    <img src={sessionStatus[index].qrcode} />
                                ) : (
                                    `${sessionStatus[index].status}`
                                )}
                            </div>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary" onClick={() => connectSession(sessionValue.name, sessionValue.token)}>
                                    Conectar
                                </button>
                                <button className="btn btn-warning">Desconectar</button>
                                <button className="btn btn-error" onClick={() => deleteSession(sessionValue.id)}>
                                    Deletar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return {
        props: {},
    };
};

export default Connect;
