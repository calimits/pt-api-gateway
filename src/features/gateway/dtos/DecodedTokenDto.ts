

type DecodedTokenDto = {
    userId: number,
    email: string,
    uuid: string,
    iat: number,
    exp: number
}

export default DecodedTokenDto;