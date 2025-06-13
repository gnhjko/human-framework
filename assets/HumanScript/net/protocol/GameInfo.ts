import { PacketBase } from "../../../HumanScript/net/PacketBase";
import { GameInfoRequest, GameInfoResponse } from "../../../HumanScript/net/Request";

export class GameInfo extends PacketBase<GameInfoRequest, GameInfoResponse> {
    constructor(request: GameInfoRequest) {
        super(null, request, "POST");
    }

    protected onResponse(response: GameInfoResponse): void {
    }
}