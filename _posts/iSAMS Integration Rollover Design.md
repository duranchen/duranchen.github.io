# 1. Analysis Summary 

## 1.1 Rollover    
  1. archive(hide|visible) & create
  2. no archive(delete) & create

## 1.2 No rollover 
  1. override

# 2. Analysis Details
##  2.1 Rollover 
### 1. archive(hide|visible) & create

1. cohort 
   * archive(idnumber with prefix,stop sync, hidden|visible)
   * create new cohorts

2. categories  
   * archive (idnumber with prefix,stop sync, hidden|visible)
     * data

       * iSAMS

         with current year

       * Moodle

         with current year
     

     * add
     * remove
     * update

   * create new categories

3. courses 
   * archive (idnumber,shortname with prefix,stop sync,hidden|visible)
   * create new courses

   ​


### 2. no archive(delete) & create

1. cohort 
   * no archive(delete)
   * create new cohorts

2. categories  
   * no archive (delete)
   * create new categories

3. courses 
   * no archive (delete)
   * create new courses


## 2.2 No rollover
### 1. override
1. cohorts - sync (add,update,hide|delete)
2. categories - sync (add,update,hide|delete)
3. courses - sync (add,update,hide|delete)

   ​


# 3. Settings Design

## current settings design
enable_isams    
hostname    

port

username   
password   
database   
auth   
removeuser (keep|suspend|delete)  
categorycourse   
coursenameformat  

## new settings design

### basic settings 
enable_isams   


### iSAMS DB Options
hostname  
port    
username   
password    
database 

### Sync Options 
auth   

categorycourse   
coursenameformat  

removeuser (keep|suspend|delete)    
removecohort(hide|delete)       
removecategory(hide|delete)   
removecourse(hide|delete)   

### rollover Options

1. enbale_rollover 

2. schoolyear (as rollover identifier, it will be prefixed for idnumber,shortname, etc.)
   * drop-down list, change the  value will trigger a rollover.
3. rollovercohort 
   * hide|visible|delete
4. rollovercategory 
   * hide|visible|delete
5. rollovercourse 
   * hide|visible|delete

# 4. related db table  
to forbid the same rollover identifier. record them into DB and mark curren school year.
Table: mdl_local_nae_isams_schoolyear

|  id  | schoolyear | active |
| :--: | :--------: | :----: |
|  2   |    2016    |   1    |
|  1   |    2015    |   0    |


# 6. rollover & no rollover switch.  
When does it happen? school year ends.  
1. rollover -> no rollover  
2. no rollover -> rollover

