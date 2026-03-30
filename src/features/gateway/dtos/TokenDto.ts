


type TokenDto = {
    token: string,
    type: "access" | "refresh",
    userId: number,
    uuid: string
}

export default TokenDto;