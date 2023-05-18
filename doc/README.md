---
title: README
date: 2023-05-18T14:36:27Z
lastmod: 2023-05-18T14:50:10Z
---

# README

## UserSetting

​![fc_login](assets/fc_login-20230518143745-r021h6n.png)​  
The user login process is as follows:

* When the page is opened, a loading screen is displayed, and the user's geographical location is retrieved.
* Upon entering, a query is made in IndexedDB to check if user information exists.
* If there is no user information, a popup window is generated, prompting the user to enter a username. Please note that this step is mandatory.

And, you can change your username anytime.

​![image](assets/image-20230518144715-a3r4bde.png)​

## Sort by location and time.
Click the corresponding button to view the sorted records.  

## Create new record
Click the corresponding button to view the sorted records.Please note that all information is required.
The user-related information is only stored in the local indexedDB and not saved on the server. Each user is assigned a unique deviceId, and the server uses this ID to determine the creator of the records.

​![截屏2023-05-18 14.23.07](assets/截屏2023-05-18 14.23.07-20230518144204-0ck6d5c.png)​

## Detail Page

In the details page, you can see the basic bird information provided by the creator, as well as relevant data obtained from DBPeida. For the creator of the record, they can update the identification by clicking the 'Update' button. Non-creators won't see this button. Additionally, at the bottom, you can find a chat window where you can send messages and chat with other users.

The two images below represent what the creator sees when they open the page and what other users see when they open the page.

Please note that all information is required.

​![Creator_DP](assets/Creator_DP-20230518143909-mleqbo9.png)​

​![OtherUser_DP](assets/OtherUser_DP-20230518143842-94smfr4.png)​

## Offline Usage

You can send and receive messages and create records normally even when you are offline. When you restore your online status, the application will send the messages to the server.‍
