import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../hoc/Shared/utility';

const initialState = {
    token:  null,
    userId: null,
    erroe:  null,
    loading: false,
    authRedirectPath: "/"
}

const authSart = (state, action) => {
    return updateObject (state, {error: null, loading: true});
}

const authSuccess = (state, action) => {
    return updateObject (state, {
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false
    });
}

const authFail = (state, action) => {
    return updateObject (state, {
        error: action.error,
        loading: false
    });
}

const setAuthRedirectPath = (state, action) => { 
    return updateObject(state, {authRedirectPath: action.path});
}

const authLogout = (state, action) => {
    return updateObject (state, {
        token: null,
        userId: null,
    });
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.AUTH_START: return authSart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state, action);
        default: 
        return state;
    }
}

export default reducer;
