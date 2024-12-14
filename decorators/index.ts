import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const HasProfiles = (...roles: string[]) =>
  SetMetadata("hasProfiles", roles);
