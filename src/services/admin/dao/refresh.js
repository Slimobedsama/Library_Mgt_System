import RefreshToken from "../model/refresh.js";

class RefreshTokenDao {
    constructor() {
       this. RefreshToken = RefreshToken;
    }

    async createRefreshToken(data) {
        return await this.RefreshToken.create(data);
    }

    async findRefreshToken(id, val) {
        return await this.RefreshToken.findOne({
            userId: id,
            token: val,
            blacklisted: false
        });
    }
}

export default new RefreshTokenDao;