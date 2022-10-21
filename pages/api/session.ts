import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../db";

interface Data {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === "GET") {
        var session = await prisma.session.findMany();
        return res.status(200).json(session);
    }
    if (req.method === "POST") {
        try {
            var newSession = await prisma.session.create({
                data: {
                    name: req.body.name,
                    token: req.body.token,
                },
            });
            return res.status(200).json(newSession);
        } catch (error) {
            console.error(error);
            return res.status(500).json(error.message);
        }
    }
    if (req.method === "PATCH") {
        try {
            var attSession = await prisma.session.update({
                where: {
                    name: req.body.name,
                },
                data: {
                    token: req.body.token,
                },
            });
            return res.status(200).json(attSession);
        } catch (error) {
            console.error(error);
            return res.status(500).json(error.message);
        }
    }
    if (req.method === "DELETE") {
        try {
            var deleteSession = await prisma.session.delete({
                where: {
                    id: req.body.id,
                },
            });
            var session = await prisma.session.findMany();
            return res.status(200).json(session);
        } catch (error) {
            console.error(error);
            return res.status(500).json(error.message);
        }
    }
}
