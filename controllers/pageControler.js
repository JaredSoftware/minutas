const fs = require("fs");
const path = require("path")

/// Obdc del cliente
const odbc = require("odbc")

const moment = require("moment")

const connectionString = {
	//connectionString: 'DSN=cosmos',
	connectionString: 'DSN=CCMS_2PREVIEW_DSN',
	connectionTimeout: 10,
	loginTimeout: 10,
}

const crearDasboard = (fecha) => {
	const connection = odbc.connect(connectionString, async (error, connection) => {

		const user = [
			{ nombre: "Karen Reina", id: "6078" },
			{ nombre: "Jeison Arevalo", id: "6077" },
			{ nombre: "Ronald Martinez", id: "6079" },
			{ nombre: "Andres Calderon", id: "6080" },
			{ nombre: "Andrea Perez", id: "6073" }
		]
		const userskill = []

		for (let index = 0; index < user.length; index++) {
			const fecha_actual = moment(fecha).format("YYYY-MM")
			const fecha_lessmonth =  moment(fecha_actual).add(1,"M").format("YYYY-MM")
			const cantidad = await connection.query(`SELECT COUNT(*)
			FROM dbo.eCSRStat
			WHERE AgentID = '${user[index].id}'
			AND "OriginatedStamp" > '${fecha_actual}'
			AND "OriginatedStamp" < '${fecha_lessmonth}'
			ORDER BY "OriginatedStamp" DESC`);
			userskill.push({nombre:user[index].nombre,id:user[index].id ,cantidad })
		}

		const meses = []
		for (let index = 1; index < 12; index++) {
			const fecha_time = moment(fecha).subtract(index, "months").format("YYYY-MM")
			const quitar = moment(fecha_time).add(1, "months").format("YYYY-MM")
			const cantidad = await connection.query(`SELECT COUNT(*),SUM(HandlingTime)
			FROM dbo.eCSRStat
			WHERE ContactSubType = 'DO'
			OR ContactSubType = 'CDN'
			AND "OriginatedStamp" > '${fecha}'
			AND "OriginatedStamp" < '${quitar}'
			ORDER BY "OriginatedStamp" DESC`);
			console.log(fecha);
			console.log(quitar);
			meses.push({ fecha: moment(fecha).format("MM"), cantidad: cantidad })
		}

		const entrantes = await connection.query(`SELECT COUNT(*) ,SUM(HandlingTime) 
		FROM dbo.eCSRStat
		WHERE ContactSubType = 'CDN'
		AND "OriginatedStamp" > '${moment(fecha).format("YYYY-MM-DD")}'
		AND "OriginatedStamp" < '${moment(fecha).add(1, "d").format("YYYY-MM-DD")}'
		ORDER BY "OriginatedStamp" DESC`);
		const salientes = await connection.query(`SELECT COUNT(*),SUM(HandlingTime)
		FROM dbo.eCSRStat
		WHERE ContactSubType = 'DO'
		AND "OriginatedStamp" > '${moment(fecha).format("YYYY-MM-DD")}'
		AND "OriginatedStamp" < '${moment(fecha).add(1, "d").format("YYYY-MM-DD")}'
		ORDER BY "OriginatedStamp" DESC `);
		const indicadores = await connection.query(`SELECT "Timestamp", SkillsetID, Skillset, ApplicationID, Application, ContactType, ActiveTime, AllAgentBusyTime, CallsAnswered, CallsAnsweredAfterThreshold, CallsAnsweredDelay, CallsOffered, SkillsetAbandoned, SkillsetAbandonedDelay, SkillsetAbandonedAftThreshold, MaxAnsweredDelay, MaxSkillsetAbandonedDelay, NetCallsAnswered, TotalStaffedTime, VirtualCallsOffered, VirtualCallsAbandoned, PostCallProcessingTime, TalkTime, WaitTime, DNOutExtCallsTalkTime, DNOutIntCallsTalkTime, "Time", SiteID, Site, VirtualCallsAbnAftThreshold, MaxCapacityTotalStaffedTime, MaxCapacityIdleTime, IdleTime, NotReadyTime
		FROM dbo.iSkillsetStat
		where Application NOT IN ('System_Application') 
		and Skillset = 'IN_Cosmos'
		AND "Timestamp" > '${moment(fecha).format("YYYY-MM-DD")}'
		order by "Timestamp"  asc`)

		const dias_con_datos = []

		for (let index = 0; index < 7; index++) {

			const fecha_format = moment(fecha).subtract(index, "d").format("YYYY-MM-DD");
			const fecha_mas = moment(fecha_format).add(1, "d").format("YYYY-MM-DD");
			const contador = await connection.query(`SELECT SUM(CallsAnswered), SUM(CallsAnswered), SUM(CallsOffered), SUM(SkillsetAbandoned) FROM dbo.iSkillsetStat
			where Application NOT IN ('System_Application') 
			and Skillset = 'IN_Cosmos'
			AND "Timestamp" > '${fecha_format}'
			AND "Timestamp" < '${fecha_mas}'
			order by "Timestamp"  asc`)

			const nivel_servicio = Number(contador[0].Aggregate_2) * 100 / Number(contador[0].Aggregate_3)
			const dias = [
				'L',
				'M',
				'Ms',
				'J',
				'V',
				'S',
				'D',
			];
			const numeroDia = new Date(fecha_format).getDay();
			const nombreDia = dias[numeroDia];
			console.log(nombreDia);

			dias_con_datos.push({ dia: nombreDia, calor: contador[0].Aggregate_1, servicio: nivel_servicio, abandoned: contador[0].Aggregate_4 })
		}

		const dasgboardjson = fs.existsSync(path.resolve(__dirname, "dashboard.json"));
		const json = { entrantes, salientes, indicadores, dias_con_datos, meses, userskill }
		if (dasgboardjson == true) {
			await fs.unlinkSync(path.resolve(__dirname, "dashboard.json"));
			await fs.writeFileSync(path.resolve(__dirname, "dashboard.json"), JSON.stringify(json, (key, value) =>
				typeof value === 'bigint'
					? value.toString()
					: value // return everything else unchanged
			));
		} else {
			await fs.writeFileSync(path.resolve(__dirname, "dashboard.json"), JSON.stringify(json, (key, value) =>
				typeof value === 'bigint'
					? value.toString()
					: value // return everything else unchanged
			));
		}
	});
	return "hecho"
}

const llamada_dash = async(fecha) => {
	const transformDate = new Date(fecha)
	const hours = Number(transformDate.getHours())
	await crearDasboard(fecha)
	return "hecho"
	/*if (hours > 1) {
		crearDasboard(fecha)
	}*/
}

const fecha_actual = moment().format("YYYY-MM-DD hh:mm:ss")
const milisegundos = 86400000
setInterval(llamada_dash, milisegundos, fecha_actual)

// cargar
const file = async (req, res) => {
	const file = req.params.file
	res.render(`file.html`,{file});
}

const out = async (req, res) => {
	req.session.req.session.loginU = false;
	res.redirect("/")
}

const dahsboard = async (req, res) => {
	const files = require("./archivos.json");
	res.render("dashboards.html",{files:files.archivos});
}

const updatedash = async (req, res) => {
	const info = req.body
	const fecha_update = moment(info).format("YYYY-MM-DD")
	llamada_dash(fecha_actual)
	res.send("hecho")
}

const makeTables = async (req, res) => {
	if (req.session.loginU == true) {
		res.render("makerTable.html")
	} else {
		res.redirect("/")
	}
}

const indicadores = (req, res) => {
	const connection = odbc.connect(connectionString, (error, connection) => {
		connection.query(`SELECT SkillsetAbandonedDelay, "Timestamp", SkillsetID, Skillset, ApplicationID, Application, ContactType, ActiveTime, AllAgentBusyTime, CallsAnswered, CallsAnsweredAfterThreshold, CallsAnsweredDelay, CallsOffered, SkillsetAbandoned, SkillsetAbandonedDelay, SkillsetAbandonedAftThreshold, MaxAnsweredDelay, MaxSkillsetAbandonedDelay, NetCallsAnswered, TotalStaffedTime, VirtualCallsOffered, VirtualCallsAbandoned, PostCallProcessingTime, TalkTime, WaitTime, DNOutExtCallsTalkTime, DNOutIntCallsTalkTime, "Time", SiteID, Site, VirtualCallsAbnAftThreshold, MaxCapacityTotalStaffedTime, MaxCapacityIdleTime, IdleTime, NotReadyTime
FROM dbo.iSkillsetStat
where Application NOT IN ('System_Application') 
and Skillset = 'IN_Cosmos'
AND "Timestamp" > '${req.body.fi}'
AND "Timestamp" < '${req.body.ff}'
order by "Timestamp"  asc`, async (error, result) => {
			if (error) { console.log(error) }
			const change = []
			await result.map((x, y) => {
				const minuto = String(result[y].Timestamp[14] + result[y].Timestamp[15]);
				const hora = String(result[y].Timestamp[11] + result[y].Timestamp[12]);
				const dia = String(result[y].Timestamp[8] + result[y].Timestamp[9])
				const mes = String(result[y].Timestamp[5] + result[y].Timestamp[6])
				const year = String(result[y].Timestamp[2] + result[y].Timestamp[3])
				const date = `${year}/${mes}/${dia}:${hora}`;
				const minutos = `${minuto}`;
				if (change.some(element => element.Timestamp == date)) {
					const indice = change.length - 1;
					console.log(change[indice].SkillsetAbandonedDelay);
					change[indice].SkillsetAbandonedDelay += x.SkillsetAbandonedDelay
					change[indice].ActiveTime += x.ActiveTime
					change[indice].AllAgentBusyTime += x.AllAgentBusyTime
					change[indice].CallsAnswered += x.CallsAnswered
					change[indice].CallsAnsweredAfterThreshold += x.CallsAnsweredAfterThreshold
					change[indice].CallsAnsweredDelay += x.CallsAnsweredDelay
					change[indice].CallsOffered += x.CallsOffered
					change[indice].SkillsetAbandoned += x.SkillsetAbandoned
					change[indice].SkillsetAbandonedDelay += x.SkillsetAbandonedDelay
					change[indice].SkillsetAbandonedAftThreshold += x.SkillsetAbandonedAftThreshold
					change[indice].MaxAnsweredDelay += x.MaxAnsweredDelay
					change[indice].MaxSkillsetAbandonedDelay += x.MaxSkillsetAbandonedDelay
					change[indice].NetCallsAnswered += x.NetCallsAnswered
					change[indice].TotalStaffedTime += x.VirtualCallsOffered
					change[indice].VirtualCallsOffered += x.VirtualCallsOffered
					change[indice].VirtualCallsAbandoned += x.VirtualCallsAbandoned
					change[indice].PostCallProcessingTime += x.PostCallProcessingTime
					change[indice].TalkTime += x.TalkTime
					change[indice].DNOutExtCallsTalkTime += x.DNOutExtCallsTalkTime
					change[indice].DNOutIntCallsTalkTime += x.DNOutIntCallsTalkTime
					change[indice].VirtualCallsAbnAftThreshold += x.VirtualCallsAbnAftThreshold
					change[indice].MaxCapacityTotalStaffedTime += x.MaxCapacityTotalStaffedTime
					change[indice].MaxCapacityIdleTime += x.MaxCapacityIdleTime
					change[indice].IdleTime += x.IdleTime
					change[indice].NotReadyTime += x.NotReadyTime
				} else {
					const objeto = {
						SkillsetAbandonedDelay:x.SkillsetAbandonedDelay,
						Timestamp: date,
						minuto:minutos,
						SkillsetID: x.SkillsetID,
						Skillset: x.Skillset,
						ApplicationID: x.ApplicationID,
						Application: x.Application,
						ContactType: x.ContactType,
						ActiveTime: x.ActiveTime,
						AllAgentBusyTime: x.AllAgentBusyTime,
						CallsAnswered: x.CallsAnswered,
						CallsAnsweredAfterThreshold: x.CallsAnsweredAfterThreshold,
						CallsAnsweredDelay: x.CallsAnsweredDelay,
						CallsOffered: x.CallsOffered,
						SkillsetAbandoned: x.SkillsetAbandoned,
						SkillsetAbandonedDelay: x.SkillsetAbandonedDelay,
						SkillsetAbandonedAftThreshold: x.SkillsetAbandonedAftThreshold,
						MaxAnsweredDelay: x.MaxAnsweredDelay,
						MaxSkillsetAbandonedDelay: x.MaxSkillsetAbandonedDelay,
						NetCallsAnswered: x.NetCallsAnswered,
						TotalStaffedTime: x.TotalStaffedTime,
						VirtualCallsOffered: x.VirtualCallsOffered,
						VirtualCallsAbandoned: x.VirtualCallsAbandoned,
						PostCallProcessingTime: x.PostCallProcessingTime,
						TalkTime: x.TalkTime,
						WaitTime: x.WaitTime,
						DNOutExtCallsTalkTime: x.DNOutExtCallsTalkTime,
						DNOutIntCallsTalkTime: x.DNOutIntCallsTalkTime,
						Time: x.Time,
						SiteID: x.SiteID,
						Site: x.Site,
						VirtualCallsAbnAftThreshold: x.VirtualCallsAbnAftThreshold,
						MaxCapacityTotalStaffedTime: x.MaxCapacityTotalStaffedTime,
						MaxCapacityIdleTime: x.MaxCapacityIdleTime,
						IdleTime: x.IdleTime,
						NotReadyTime: x.NotReadyTime
					}
					change.push(objeto)
				}
			});
			res.render("indicadores.html", { result: change })
		});
	});

}

const llamadas = (req, res) => {
	const connection = odbc.connect(connectionString, async (error, connection) => {
		const entrantes = await connection.query(`SELECT OriginatedStamp, CustID, SequenceID, "GUID", CCMID, ProviderContactID, InterCallID, ContactType, ContactTypeName, ContactSubType, ContactProximity, Priority, Provider, SiteID, SiteName, RemoteSiteID, RemoteSiteName, Originator, Address, RoutePoint, ApplicationID, ApplicationName, SourceApplicationName, ApplicationStartStamp, LastTreatmentID, Treatment, LastTreatmentStamp, LastTreatmentTime, SkillsetID, SkillsetName, SkillsetQueuedStamp, LocalUserID, AgentSurName, AgentGivenName, SupervisorSurName, SupervisorGivenName, AgentID, SupervisorID, InitialDisposition, ServiceStamp, AppAbandonDelay, AppAcceptedDelay, SksAbandonDelay, SksAcceptedDelay, HandlingTime, ConsultTime, HoldTime, NumberOfTimesOnHold, NumberOfTimesRTQ, FinalDisposition, FinalDispositionStamp, PresentingTime, PCPTime, PCPFirstCode, WaitTime, NextAddress, NextSegmentID, ContactOriginatedStamp, FinalDispositionInterval, ServiceInterval, OriginatedInterval, DisconnectSource, NumContactObserves, NumContactBargeIns, AnchoredMediaServer, PreferredMediaServer, PreferredMediaServerResult, PreferredMediaServerResultDesc, NumContactWhisperCoachings
		FROM dbo.eCSRStat
		WHERE "OriginatedStamp" > '${req.body.fi}'
		AND "OriginatedStamp" < '${req.body.ff}'
		ORDER BY "OriginatedStamp" DESC`);
		console.log(entrantes.length);
		res.render("llamadas.html", { entrantes})
	});
}

// find user
const findU = async (req, res) => {
	const info = req.body
	if (info.email == "admin@admin" && info.password == "Admin2023") {
		req.session.req.session.loginU = true;
		res.send({ login: true })
	} else {
		res.send({ login: false })
	}
}

module.exports = {
	findU,
	dahsboard,
	makeTables,
	indicadores,
	llamadas,
	updatedash,
	out,
	file
}