import RefreshTokenDao from '../dao/refresh.js';

export const refreshTokenFactory = async(data)=> {
    return await RefreshTokenDao.createRefreshToken(data)
}

export const getRefreshTokenFactory = async(id, val)=> {
    return await RefreshTokenDao.findRefreshToken(id, val);  
}