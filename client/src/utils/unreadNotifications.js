export const unreadNotificationsFunc = (notifications) =>{
    return notifications.filter((n) => n.isRead === false) //if a notification is not read we will return it to this function
}