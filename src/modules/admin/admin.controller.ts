import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import * as AdminService from './admin.service';
import { success } from "zod";


export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await AdminService.getAllUsers();
    res.status(200).json({success: true, data: users});

})

export const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const {status } = req.body;
    const user = await AdminService.updateUserStatus(req.params.id, status);
    res.status(200).json({
        success: true,
        message: `User ${status === 'BANNED' ? 'banned': 'unbanned'} successfully`,
        data: user,
    });
});

export const getAllProperties = catchAsync(async (req: Request, res: Response) =>{
    const properties = await AdminService.getAllPropertiesAdmin();
    res.status(200).json({success: true, data: properties});
});

export const getAllRentalRequests = catchAsync(async(req: Request, res: Response) =>{
    const requests = await AdminService.getAllRentalRequestsAdmin();
    res.status(200).json({success: true, data: requests});
    
})