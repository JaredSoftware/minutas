SELECT "Timestamp", SkillsetID, Skillset, ApplicationID, Application, ContactType, ActiveTime, AllAgentBusyTime, CallsAnswered, CallsAnsweredAfterThreshold, CallsAnsweredDelay, CallsOffered, SkillsetAbandoned, SkillsetAbandonedDelay, SkillsetAbandonedAftThreshold, MaxAnsweredDelay, MaxSkillsetAbandonedDelay, NetCallsAnswered, TotalStaffedTime, VirtualCallsOffered, VirtualCallsAbandoned, PostCallProcessingTime, TalkTime, WaitTime, DNOutExtCallsTalkTime, DNOutIntCallsTalkTime, "Time", SiteID, Site, VirtualCallsAbnAftThreshold, MaxCapacityTotalStaffedTime, MaxCapacityIdleTime, IdleTime, NotReadyTime
FROM dbo.iSkillsetStat
where Application NOT IN ('System_Application') and Skillset = 'IN_Cosmos'
order by "Timestamp"

SELECT CustID, SequenceID, "GUID", CCMID, ProviderContactID, InterCallID, ContactType, ContactTypeName, ContactSubType, ContactProximity, Priority, Provider, SiteID, SiteName, RemoteSiteID, RemoteSiteName, Originator, Address, RoutePoint, ApplicationID, ApplicationName, SourceApplicationName, ApplicationStartStamp, LastTreatmentID, Treatment, LastTreatmentStamp, LastTreatmentTime, SkillsetID, SkillsetName, SkillsetQueuedStamp, LocalUserID, AgentSurName, AgentGivenName, SupervisorSurName, SupervisorGivenName, AgentID, SupervisorID, OriginatedStamp, InitialDisposition, ServiceStamp, AppAbandonDelay, AppAcceptedDelay, SksAbandonDelay, SksAcceptedDelay, HandlingTime, ConsultTime, HoldTime, NumberOfTimesOnHold, NumberOfTimesRTQ, FinalDisposition, FinalDispositionStamp, PresentingTime, PCPTime, PCPFirstCode, WaitTime, NextAddress, NextSegmentID, ContactOriginatedStamp, FinalDispositionInterval, ServiceInterval, OriginatedInterval, DisconnectSource, NumContactObserves, NumContactBargeIns, AnchoredMediaServer, PreferredMediaServer, PreferredMediaServerResult, PreferredMediaServerResultDesc, NumContactWhisperCoachings
FROM dbo.eCSRStat

SELECT COUNT(CallsAnswered) FROM dbo.iSkillsetStat
		where Application NOT IN ('System_Application') 
		and Skillset = 'IN_Cosmos'
		AND "Timestamp" > '2023-01-14'
		AND "Timestamp" < '2023-01-15'
		order by "Timestamp"  asc