public with sharing class getAllTasks {
  @AuraEnabled(cacheable=true)
  public static List<Task> getTasksForMe() {
    try {
      return [SELECT Subject FROM Task];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static Task addToDoToDataBase(String subject) {
    try {
      Task newTask = new Task(
        Subject = subject,
        OwnerId = UserInfo.getUserId(),
        Status = 'Not Started',
        Priority = 'Normal'
      );
      insert newTask;
      return newTask;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static Boolean deleteToDo(Id recordId) {
    try {
      Database.delete(recordId);
      return true;
    } catch (Exception e) {
      System.debug(e.getMessage());
    }
    return false;
  }
}
