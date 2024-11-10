import * as actionTypes from './actionTypes';

export const fetchAuthUser = (data) => ({
  type: actionTypes.FETCH_AUTHUSER,
  data,
});

export const fetchAuthUserFail = (error) => ({
  type: actionTypes.FETCH_AUTHUSER_FAIL,
  error,
});

export const fetchOtherStats = (data) => ({
  type: actionTypes.FETCH_OTHERSTATS,
  data,
});

export const fetchOtherStatsFail = (error) => ({
  type: actionTypes.FETCH_OTHERSTATS_FAIL,
  error,
});

export const fetchPolls = (data) => ({
  type: actionTypes.FETCH_SALES,
  data,
});

export const fetchPollsFail = (error) => ({
  type: actionTypes.FETCH_SALES_FAIL,
  error,
});