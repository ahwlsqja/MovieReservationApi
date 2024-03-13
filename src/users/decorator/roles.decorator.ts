import { SetMetadata } from "@nestjs/common";
import { RolesEnum } from "../const/roles.const";

export const ROLES_KEY = 'user_roles';

// @Roles(RolesEnum.ADMIN)
export const Roles = (role: RolesEnum)=> SetMetadata(ROLES_KEY, role)
// 메타 데이터 세팅할때 키값을 넣어주고 키값에 해당하는 값을 넣어주면 된다.