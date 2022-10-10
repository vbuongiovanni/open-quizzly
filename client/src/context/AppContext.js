import {createContext} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { timedUserMsg } from "./../modules/timedUserMsg";

export const AppContext = createContext();

const authAxios = axios.create();

// create axios interceptor that will be used in authenticated api requests:
authAxios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`
  return config;
});

export const AppContextProvider = (props) => {

  // navigate functions:
    const navigate = useNavigate();
    
    const navToLogin = () => {
      navigate("/");
    };

    const navToMenu = () => {
      navigate("/menu");
    };

    const navToQuizCreator = () => {
      navigate("/quiz/creator");
    };

    const navToUserStats = () => {
      navigate("/user/stats");
    };

    const navToQuiz = (quizId) => {
      navigate(`/quiz/${quizId}`);
    };

    const navToActiveQuiz = (quizId) => {
      navigate(`/quiz/active/${quizId}`);
    };

    const navCallbacks = {
      navToLogin, navToMenu,
      navToQuizCreator, navToUserStats,
      navToQuiz, navToActiveQuiz
    };

  // general input handlers
    const loginFormHandler = (target, formInputSetter, userMsgSetter) => {
      const {name, value} = target;
      if (name === "username") {
        const pattern = /\w/
        const restrictedChars = value.split("").every(element => {
          return pattern.test(element);
        });
        if (!restrictedChars) {
          timedUserMsg("Please use only alphanumeric characters for username.", userMsgSetter)
        } else {
          userMsgSetter("")
          formInputSetter(prevInputs => ({...prevInputs, [name] : value}))
        };
      } else {
        const pattern = /(\w|!|@|#|\?)/
        const restrictedChars = value.split("").every(element => {
          return pattern.test(element);
        });
        if (!restrictedChars) {
          timedUserMsg("Valid characters password include only alphanumeric and _, !, @, #, $, and ?", userMsgSetter);
        } else {
          userMsgSetter("");
          formInputSetter(prevInputs => ({...prevInputs, [name] : value}));
        };
      };
    };

  // request callbacks
    // /auth request - new and existing user signup/login
      const userAuthReq = (type, loginFormInputs, userStateSetter, userMsgSetter) => {
        axios.post(`/auth/${type}`, loginFormInputs)
          .then(res => {
            userStateSetter({...res.data});
            localStorage.setItem("token", res.data.token);
          })
          .catch(err => userMsgSetter(err.response.data.errMsg));
      };

    // /user requests
      // request user summary stats:
        const getUserSummaryStats = (stateSetter) => {
          authAxios.get(`/api/user/summary`)
            .then(res => stateSetter(res.data))
            .catch(err => console.log(err));
        };

      // request user summary stats:
        const getUserGlobalStats = (stateSetter) => {
          authAxios.get(`/api/user/global`)
            .then(res => stateSetter(res.data))
            .catch(err => console.log(err));
        };

      // request historical performance of a specific quiz:
        const getUserQuizPerformance = (quizId, stateSetter) => {
          authAxios.get(`/api/user/historical/summary?quizId=${quizId}`)
            .then(res => stateSetter(res.data))
            .catch(err => console.log(err));
        };

      // request previous answers that were recorded by user for a specific quiz:
        const getUserQuizResults = (quizId, stateSetter) => {
          authAxios.get(`/api/user/historical/results?quizId=${quizId}`)
            .then(res => stateSetter(res.data))
            .catch(err => console.log(err));
        };

      // post new answer result to database:
        const postAnswer = newAnswer => {
          authAxios.post("/api/user/answer", newAnswer)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
        };

    // /quiz requests
      // req all available quizzes
        const getQuizData = stateSetterFunc => {
          authAxios.get("/api/quiz")
            .then(res => stateSetterFunc(res.data))
            .catch(err => console.log(err));
        };

      // view and select details pertaining to a specific quiz
        const getQuizDetails = (quizId, quizDetailSetter, topicStateSetter) => {
          authAxios.get(`/api/quiz/${quizId}`)
            .then(res => {
              quizDetailSetter(res.data);
              topicStateSetter(res.data.topicSelections);
            })
            .catch(err => console.log(err));
        };

      // start a quiz
        const generateQuiz = (quizId, stateSetterFunc, quizConfig) => {
          authAxios.post(`/api/quiz/generate/${quizId}`, quizConfig)
            .then(res => stateSetterFunc(res.data))
            .catch(err => console.log(err));
        };

      // post new quiz
        const postQuiz = (newQuizData, userMsgSetter) => {
          authAxios.post(`/api/quiz/add`, newQuizData)
            .then(res => console.log("posted"))
            .catch(err => timedUserMsg(err.response.data.errMsg, userMsgSetter));
        };

  return (
    <AppContext.Provider value={{
                          navCallbacks,
                          userAuthReq, loginFormHandler, 
                          getUserSummaryStats, getUserQuizPerformance, getUserGlobalStats, postAnswer, getUserQuizResults,
                          getQuizData, getQuizDetails, generateQuiz, postQuiz
                          }}>
      {props.children}
    </AppContext.Provider>
  );
};