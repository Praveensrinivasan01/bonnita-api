import { InternalServerErrorException } from "@nestjs/common";

export class CommonService {

    public static error(error: InternalServerErrorException): Object {
        return {
            statusCode: 500,
            message: new InternalServerErrorException(error)['response']['name'],
            error: "Internal Server Error"
        }
    }
}