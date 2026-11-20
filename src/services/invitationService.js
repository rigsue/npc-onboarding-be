import { randomBytes, createHash } from "node:crypto";

import { 
    createUserInvite, createInviteNotif, updateInviteEmailStat
 } from "../models/userInviteModel.js";

 import { sendemail } from "./mailService.js";

 const INVITITATION_EXPIRY_HOURS = 24;

 function hashToken(token) {
    return createHash("sha256")
        .update(token)
        .digest("hex");
 }


//  prepare invitation inside db transaction
export async function prepareUserInvite(
    userId, createdBy, connection
) {
    
}