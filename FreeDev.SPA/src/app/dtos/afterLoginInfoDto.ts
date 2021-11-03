export interface AfterLoginInfoDto {
    access_token: string;
    expiresIn: number;
    user: any // developerDto | HunterDto
}