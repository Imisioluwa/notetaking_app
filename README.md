### notetaking_app(WRITESMART)

  At the end of this task The Notes taking console application is expected to have the following functionalities:
  However, deliverables below have been implemented and can be utilized by the user now. A user can choose
  either to create account on the Note taking application in order to create note or not.

  At the initial phase if the user choose to create account on the note taking application. The user is 
  required to type signup. After signup successful, the user will type login after which he/she can take 
  notes by typing createnote.
         
 ###help 
- User can use the help keyword to search for instructions guiding the application using the HELP keyword.
          

###exit 
-User can exit from the application using the EXIT keyword. 
          

 ###signup 
- User can create a writesmart account using SIGNUP keyword. The application allows users with or without user accounts on writesmart to write notes
          
###createnote 
- User can write a note on a note text editor using CREATENOTE keyword.
          
###viewnote note-id 
- User can view notes written by using the keyword VIEWNOTE and ID respectively
          
###deletenote note-id 
- User can delete a single note using the DELETENOTE and ID respectively
          
###listnotes options 
- List all notes with the keyword LISTNOTES and OPTIONS e.g listnotes limit 5
                   to display five notes maximum.
         
###next 
- User can type next to display the remaining notes.

###syncnotes --
-- User can write, store and retrieve notes from firebase.

###searchnote ---
-- User will be able to search for notes with keyword using searchnotes <notetitle.contains.('any word in the title')>
   or searchnotes <notecontent.contains('any word in the title')> or searchnotes <notetitle_notecontent.contains('any word in the title')>



    -------------------------------------------------------------------------------------

    
   
###export json, csv --
-- User will be able to export notes in json or csv file format.