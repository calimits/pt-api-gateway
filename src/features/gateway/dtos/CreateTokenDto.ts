


type CreateTokenDto = {
    token: string,
    type: "access" | "refresh",
    uuid: string,
    userId: number
}

export default CreateTokenDto;