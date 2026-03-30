import { UserDto } from "./UserDto";


type LoggedInDto = {
    refreshToken: string,
    accessToken: string,
    userInfo: UserDto
}

export default LoggedInDto;