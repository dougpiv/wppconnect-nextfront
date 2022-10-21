import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";

interface Props {}

const Sendmessage: NextPage<Props> = ({}) => {
    const [loop, setLoop] = useState(false);
    const [message, setMessage] = useState({
        phone: "",
        message: "",
    });
    useEffect(() => {
        if (loop) {
            session !== undefined ? api.post(`${session}/send-message`, message) : "";
            const timer = setTimeout(() => setReload(reload + 1), 3e3);
            return () => clearTimeout(timer);
        }
    }, [reload, loop]);
    const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let values = Object.fromEntries(new FormData(event.currentTarget).entries());
        console.log(values);
        setMessage({ phone: values.phone.toString(), message: values.message.toString() });
        setLoop(true);
    };

    const stopSending = () => {
        setLoop(false);
    };
    return (
        <div className="flex flex-col p-3">
            <form onSubmit={sendMessage}>
                <h1>Enviar MSG:</h1>
                <label className="label">Telefone:</label>
                <input className="max-w-[128px] mr-4 input input-bordered" type="text" name="phone" />
                <label className="label">Mensagem:</label>
                <input className="max-w-[128px] mr-4 input input-bordered" type="text" name="message" />
                <button className="btn" type="submit">
                    Enviar
                </button>
            </form>
            <div>
                <button className="btn" onClick={stopSending}>
                    Parar
                </button>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return {
        props: {},
    };
};

export default Sendmessage;
