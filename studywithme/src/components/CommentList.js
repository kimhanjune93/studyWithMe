import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as commentActions } from "../redux/modules/comment";
//icon
import { ReactComponent as Trash } from "../icon/trash.svg";
import { ReactComponent as CommentLikeOff } from "../icon/commentLikeOff.svg";
import { ReactComponent as CommentLikeOn } from "../icon/commentLikeOn.svg";

import Image from "../elements/Image";
import Text from "../elements/Text";
import Button from "../elements/Button";
import time from "../shared/time";
const CommentList = (props) => {
  const postId = props.postId;
  const dispatch = useDispatch();
  const comment = useSelector((state) => state.comment.list);
  const user = useSelector((state) => state.user.user);
  const userId = user?.userId;
  const deleteComment = (commentId) => {
    if (window.confirm("삭제하시겠습니까?") === true) {
      dispatch(commentActions.deleteCommentMiddleware(postId, commentId));
    }
  };
  const deleteLike = (postId, commentId) => {
    dispatch(commentActions.deleteCommentLikeMiddleWare(postId, commentId));
  };
  const addLike = (postId, commentId) => {
    dispatch(commentActions.addCommentLikeMiddleWare(postId, commentId));
  };
  const changePage = (number) => {
    console.log(number);
  }
  useEffect(() => {
    dispatch(commentActions.getCommentMiddleware(postId));
  }, []);

  return (
    <React.Fragment>
      <FlexGrid direction="column" justify="center" margin="10px 0px">
        {comment.map((c, idx) => {
          return (
            <FlexGrid
              key={c.commentId}
              justify="space-between"
              align="center"
              margin="5px 0px"
            >
              <FlexGrid align="center">
                <FlexGrid align="center" minWidth="130px">
                  <Image
                    size="36"
                    src={`${process.env.REACT_APP_IMAGE_URI}/${c.avatarUrl}`}
                  />
                  <FlexGrid direction="column" margin="0px 5px">
                    <Text size="15px">{c.userNickname}</Text>
                    <Text size="10px" color="#cccccc">
                      {time(c.date)}
                    </Text>
                  </FlexGrid>
                </FlexGrid>
                <FlexGrid direction="column" maxWidth="550px">
                  <Text>{c.textContent}</Text>
                  <FlexGrid>
                    <Button padding="0px">좋아요</Button>
                    <Text>{c.commentLikeCnt}</Text>
                  </FlexGrid>
                </FlexGrid>
              </FlexGrid>
              {c.userId === userId ? (
                <Trash
                  className="iconButton"
                  style={{ width: "20px", height: "20px" }}
                  onClick={() => {
                    deleteComment(c.commentId);
                  }}
                />
              ) : c.isCommentLiked ? (
                <CommentLikeOn
                  className="iconButton"
                  style={{ width: "20px", height: "20px" }}
                  onClick={() => {
                    deleteLike(postId, c.commentId);
                  }}
                />
              ) : (
                <CommentLikeOff
                  className="iconButton"
                  style={{ width: "20px", height: "20px" }}
                  onClick={() => {
                    addLike(postId, c.commentId);
                  }}
                />
              )}
            </FlexGrid>
          );
        })}
        <FlexGrid align = "center" margin="auto">
          <Page className="textButton" onClick={()=>{changePage(1)}}>1</Page>
          <Page className="textButton" onClick={()=>{changePage(2)}}>2</Page>
          <Page className="textButton" onClick={()=>{changePage(3)}}>3</Page>
        </FlexGrid>
      </FlexGrid>
    </React.Fragment>
  );
};
const FlexGrid = styled.div`
  display: flex;
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : "750px")};
  ${(props) => (props.minWidth ? `min-width:${props.minWidth};` : null)};
  ${(props) => (props.color ? `background-color:${props.color};` : null)};
  ${(props) => (props.margin ? `margin:${props.margin};` : null)};
  ${(props) => (props.direction ? `flex-direction:${props.direction};` : null)};
  ${(props) => (props.align ? `align-items:${props.align};` : null)};
  ${(props) => (props.justify ? `justify-content:${props.justify};` : null)};
  ${(props) => (props.padding ? `padding:${props.padding};` : null)};
`;
const Page = styled.p`
  margin: 5px;
`;
export default CommentList;
