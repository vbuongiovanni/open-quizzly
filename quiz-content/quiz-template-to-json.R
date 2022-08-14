library(tidyverse)
library(openxlsx)
library(rjson)

setwd("/Users/vbuongiovanni/Documents/VSchool/open-quizzly/quiz-content/")

sheet_names <- getSheetNames("quiz-template.xlsx")

for (s in seq_along(sheet_names)) {
  
  test_repo <- read.xlsx(xlsxFile = "quiz-template.xlsx", sheet = sheet_names[s])
  
  quizSubject <- unique(test_repo$subject)
  quizName <- unique(test_repo$quizName)
  
  quizQuestions <- test_repo %>% 
    select(topic, questionText, correctAnswer) %>% 
    distinct_all()
  
  all_topics <- unique(quizQuestions$topic)
  
  topicsCompiled <- list()
  
  for (t in seq_along(all_topics)) {
    
    quizTopicCompiled <- list(list(topicName = all_topics[t]))
    
    filtered_topic <- test_repo %>% 
      filter(topic == all_topics[t])
    
    all_questions <- unique(filtered_topic$questionText)
    
    quizQuestionsCompiled <- list()
    
    for (q in seq_along(all_questions)) {
      filtered_questions <- test_repo %>% 
        filter(questionText == all_questions[q])
      
      question <- list(list(questionText = unique(filtered_questions$questionText),
                            correctAnswer = unique(filtered_questions$correctAnswer),
                            incorrectAnswers = filtered_questions$IncorrectAnswer))
      names(question) = (q - 1)
      
      quizQuestionsCompiled <- c(quizQuestionsCompiled, 
                                 question)
    }
    topic_questions = quizQuestionsCompiled
    
    compiledTopic = list(list(topicName = all_topics[t], questions = topic_questions))
    names(compiledTopic) <- (t - 1)
    
    topicsCompiled <- c(topicsCompiled, compiledTopic)
    
  }
  
  topics <- list(topicsCompiled)
  names(topics) = "topics"
  
  quiz <- c(list(quizName = quizName, quizSubject = quizSubject), topics)
  
  write(toJSON(quiz), paste0(sheet_names[s], ".json"))
  
}