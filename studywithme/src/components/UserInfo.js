import React, { useEffect, useState } from "react";
import styled from "styled-components";
import dotenv from "dotenv";
import { useSelector, useDispatch } from "react-redux";
import { AiTwotoneSetting } from "react-icons/ai";
import { actionCreators as userActions } from "../redux/modules/user";
import { actionCreators as myActions } from "../redux/modules/mypage";
import { history } from "../redux/configStore";

import Image from "../elements/Image";
import FollowerModal from "./FollowerModal";
import FollowModal from "./FollowModal";

dotenv.config();

const UserInfo = (props) => {
  const dispatch = useDispatch();

  const [followerModalOpen, setFollowerModalOpen] = useState(false);
  const [followModalOpen, setFollowModalOpen] = useState(false);

  const followerModalClose = () => {
    setFollowerModalOpen(!followerModalOpen);
  };
  const followModalClose = () => {
    setFollowModalOpen(!followModalOpen);
  };

  //state 조회
  const userInfo = useSelector((state) => state.user.userInfo);
  const followerList = useSelector((state) => state.mypage?.followerIdList);
  console.log("followerList", followerList);
  const followingList = useSelector((state) => state.mypage?.followingIdList);
  console.log("followingList", followingList);
  const userPic = `${process.env.REACT_APP_API_URI}/${userInfo?.avatarUrl}`;
  const userId = props.userId;

  useEffect(() => {
    dispatch(userActions.getUserDB(userId));
    dispatch(myActions.getFollowingsMiddleware(userId));
    dispatch(myActions.getFollowersMiddleware(userId));
  }, []);

  return (
    <React.Fragment>
      <UserInfoWrap>
        <LeftDiv>
          <ProfileImg>
            <Image size="100" src={userPic}></Image>
          </ProfileImg>
        </LeftDiv>
        <RightDiv>
          <TopDiv>
            <AiTwotoneSetting
              cursor="pointer"
              size="1.7em"
              onClick={() => {
                history.push("/userEdit/" + userId);
              }}
            ></AiTwotoneSetting>
          </TopDiv>
          <MiddleDiv>
            <Nickname>{userInfo?.nickname}</Nickname>
          </MiddleDiv>
          <BottomDiv>
            <div style={{ fontSize: "14px" }}>게시글 {userInfo?.postCnt}개</div>
            <Button onClick={followerModalClose}>
              팔로워 {followerList?.length}명
            </Button>
            {followerModalOpen && (
              <FollowerModal
                modalClose={followerModalClose}
                followerList={followerList}
              />
            )}
            <Button onClick={followModalClose}>
              팔로우 {followingList?.length}명
            </Button>
            {followModalOpen && (
              <FollowModal
                modalClose={followModalClose}
                followingList={followingList}
              />
            )}
          </BottomDiv>
        </RightDiv>
      </UserInfoWrap>
    </React.Fragment>
  );
};

const UserInfoWrap = styled.div`
  width: 100%;
  height: 300px;
  background-color: lightgray;
  display: flex;
  margin: auto;
`;
const LeftDiv = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ProfileImg = styled.div`
  height: 77px;
  width: 77px;
`;

const RightDiv = styled.div`
  width: 70%;
  height: 100%;
`;
const TopDiv = styled.div`
  display: flex;
  height: 10%;
  flex-direction: row-reverse;
`;
const MiddleDiv = styled.div`
  display: flex;
  height: 40%;
  padding: 40px 40px 40px 60px;
`;
const Nickname = styled.div`
  font-size: 48px;
`;

const Button = styled.div`
  font-size: 14px;
  cursor: pointer;
`;

const BottomDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 50%;
  margin: auto;
`;

export default UserInfo;
