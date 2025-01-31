import { Request, Response } from "express";
import { AppDataSource } from "../config";
import { UserInfo } from "../entity/user.entity";
import { Certificate } from "../entity/certificate.entity";

export const createCertificate = async (req: Request, res: Response) => {
    const certifiRepo = AppDataSource.getRepository(Certificate);
    const userRepo = AppDataSource.getRepository(UserInfo);
    const { userId, courseName } = req.body;

    if (!userId || !courseName) {
        return res.status(400).json({ message: "user Id and Course Name are required" });
    }

    try {
        const requestingUser = await userRepo.findOne({ where: { id: req.user?.id } });
        if (!requestingUser) {
            return res.status(404).json({ message: "request user not found" });
        }

        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const newCertifi = certifiRepo.create({
            user,
            courseName,
        });
        await certifiRepo.save(newCertifi);

        return res.status(201).json({
            id: newCertifi.id,
            userId: newCertifi.user.id,
            courseName: newCertifi.courseName,
            createdAt: newCertifi.createdAt.toISOString(),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

