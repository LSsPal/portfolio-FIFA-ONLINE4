import React, { useState } from "react";
import axios from "axios";
import { AiOutlineSearch } from "react-icons/ai";
import "./App.css";

function App() {
  const [userName, setUserName] = useState<string>();
  const [userLevel, setUserLevel] = useState<number>();
  const [userAccessId, setUserAccessId] = useState<string>();
  const [userRankPeak, setUserRankPeak] = useState<number>();
  const [userTier, setUserTier] = useState<string>();
  const [userMatchData, setUserMatchData] = useState<string[]>();
  const [detailMatchDataArray, setDetailMatchDataArray] = useState([null]);
  const [selected, setSelected] = useState(null);

  const DEFAULT_MATCH_TYPE = 50;

  const toggle = (index: any) => {
    if (selected === index) {
      return setSelected(null);
    }

    setSelected(index);
  };

  //입력받은 유저의 닉네임을 검색해서 유저의 고유 ID를 가져온다.
  const callUesrData = async () => {
    await axios(
      `https://api.nexon.co.kr/fifaonline4/v1.0/users?nickname=${userName}`,
      {
        method: "GET",
        headers: {
          Authorization: process.env.REACT_APP_FIFAONLINE4_API_KEY,
        },
      }
    )
      .then((res) => {
        setUserAccessId(res.data.accessId);
        setUserLevel(res.data.level);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //유저의 컨트롤러 타입을 결정한다.
  const findUserController = (controllerType: string) => {
    if (controllerType === "keyboard") {
      return "키보드";
    } else if (controllerType === "패드") {
      return "패드";
    } else {
      return "기타";
    }
  };

  //유저의 최고 등급 점수를 가져와서 switch문을 통해 올바른 등급을 출력한다.
  const searchUserPeak = (userRankPeak: number) => {
    switch (userRankPeak) {
      case 800:
        setUserTier(() => "슈퍼챔피언스");
        break;
      case 900:
        setUserTier(() => "챔피언스");
        break;
      case 1000:
        setUserTier(() => "슈퍼챌린지");
        break;
      case 1100:
        setUserTier(() => "챌린지1");
        break;
      case 1200:
        setUserTier(() => "챌린지2");
        break;
      case 1300:
        setUserTier(() => "챌린지3");
        break;
      case 2000:
        setUserTier(() => "월드클래스1");
        break;
      case 2100:
        setUserTier(() => "월드클래스2");
        break;
      case 2200:
        setUserTier(() => "월드클래스3");
        break;
      case 2300:
        setUserTier(() => "프로1");
        break;
      case 2400:
        setUserTier(() => "프로2");
        break;
      case 2500:
        setUserTier(() => "프로3");
        break;
      case 2600:
        setUserTier(() => "세미프로1");
        break;
      case 2700:
        setUserTier(() => "세미프로2");
        break;
      case 2800:
        setUserTier(() => "세미프로3");
        break;
      case 2900:
        setUserTier(() => "유망주1");
        break;
      case 3000:
        setUserTier(() => "유망주2");
        break;
      case 3100:
        setUserTier(() => "유망주3");
        break;
      default:
        alert("입력하신 유저의 데이터를 확인할 수 없습니다.");
    }
  };

  //유저의 최고 등급 점수를 가져온다.
  const callUserPeak = async () => {
    await axios(
      `https://api.nexon.co.kr/fifaonline4/v1.0/users/${userAccessId}/maxdivision`,
      {
        method: "GET",
        headers: {
          Authorization: process.env.REACT_APP_FIFAONLINE4_API_KEY,
        },
      }
    )
      .then((res) => {
        if (res.data[0].division) {
          setUserRankPeak(() => res.data[0].division);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //유저의 경기기록(matchId) 배열을 가져온다
  const callUserGameRecord = async () => {
    await axios(
      `https://api.nexon.co.kr/fifaonline4/v1.0/users/${userAccessId}/matches?matchtype=${DEFAULT_MATCH_TYPE}&offset=0&limit=100`,
      {
        method: "GET",
        headers: {
          Authorization: process.env.REACT_APP_FIFAONLINE4_API_KEY,
        },
      }
    )
      .then((res) => {
        setUserMatchData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //유저의 상세경기기록을 배열에 담는다
  const searchUserMatchData = async () => {
    if (userMatchData !== undefined) {
      for (let i = 0; i < userMatchData.length; i++) {
        await axios(
          `https://api.nexon.co.kr/fifaonline4/v1.0/matches/${userMatchData[i]}`,
          {
            method: "GET",
            headers: {
              Authorization: process.env.REACT_APP_FIFAONLINE4_API_KEY,
            },
          }
        )
          .then((res) => {
            detailMatchDataArray[i] = { ...res.data };
          })
          .catch((error) => console.log(error));
      }
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(() => event.target.value);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await callUesrData();
    await callUserPeak();
    await callUserGameRecord();
    searchUserMatchData();
    if (userRankPeak !== undefined) {
      searchUserPeak(userRankPeak);
    }
  };

  const onClick = async (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    await callUesrData();
    await (userLevel && callUserPeak());
    await (userLevel && callUserGameRecord());
    userMatchData && searchUserMatchData();
    userRankPeak && searchUserPeak(userRankPeak);
  };

  return (
    <div className="App">
      <nav className="top-nav">
        <form className="user-name-submit" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="닉네임을 입력해주세요"
            onChange={onChange}
            className="user-name-input"
          />
          <AiOutlineSearch className="submit-user-name" onClick={onClick} />
        </form>
      </nav>
      {userRankPeak ? (
        <div className="show-user-data">
          <div className="data-align">
            <div className="user-name">{userName}</div>
            <div className="user-level">레벨 {userLevel} </div>
          </div>
          <div className="user-tier">최고 등급 {userTier}</div>
        </div>
      ) : null}

      <div className="show-match-data">
        {detailMatchDataArray
          ? detailMatchDataArray.map((item: any, index: number) => (
              <div key={index}>
                <span className="match-box" onClick={() => toggle(index)}>
                  <div className="show-match-date">
                    <h6>{item && item.matchDate.substr(0, 10)}</h6>
                    <h6>{item && item.matchDate.substr(11, 14)}</h6>
                  </div>
                  {item &&
                    item.matchInfo.map((secItem: any, index: number) => (
                      <div key={index} className="show-breif-result">
                        {secItem.nickname}
                        &nbsp;
                        <div className="score">{secItem.shoot.goalTotal}</div>
                      </div>
                    ))}

                  <span>{selected === index ? "-" : "+"}</span>
                </span>
                <div className={selected === index ? "show-detail" : "detail"}>
                  <div className="main-stat">
                    <h4>평균 평점</h4>
                    <h4>점유율</h4>
                    <h4>슈팅</h4>
                    <h4>유효 슈팅</h4>
                    <h4>패스 시도</h4>
                    <h4>패스 성공률</h4>
                    <h4>컨트롤러 타입</h4>
                  </div>
                  {item &&
                    item.matchInfo.map((secItem: any, index: number) => (
                      <div key={index} className="detail-stat">
                        <h6>
                          {secItem &&
                            secItem.matchDetail.averageRating
                              .toString()
                              .substr(0, 3)}
                          <br />
                          {secItem.matchDetail.possession}
                          <br />
                          {secItem.shoot.shootTotal}
                          <br />
                          {secItem.shoot.effectiveShootTotal}
                          <br />
                          {secItem.pass.passTry}
                          <br />
                          {Math.ceil(
                            (secItem.pass.passSuccess / secItem.pass.passTry) *
                              100
                          )}
                          % <br />
                          {findUserController(secItem.matchDetail.controller)}
                        </h6>
                      </div>
                    ))}
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default App;
