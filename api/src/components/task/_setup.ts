import { t } from "elysia"

const TaskValidator = {
	createTask: {
		body: t.Object({
			name: t.String({ error: "Name is required and must be a string" }),
			points: t.Number({ error: "Points are required and must be a number" }),
			message: t.String({ error: "Message is required and must be a string" }),
			type: t.Enum(
				{
					core: "core",
					special: "special",
					daily: "daily",
					collab: "collab",
					giveaway: "giveaway",
				},
				{ error: "Type must be one of: core, special, daily, collab, giveaway" }
			),
			duration: t.Number({ error: "Duration is required and must be a number" }),
			activeFrom: t.Enum(
				{
					signUp: "signUp",
					taskLaunch: "task launch", 
				},
				{ error: "ActiveFrom must be 'signUp' or 'taskLaunch'" }
			),
			verifyBy: t.Enum(
				{
					bot: "bot",
					admin: "admin",
				},
				{ error: "verifyBy must be 'bot' or 'admin'" }
			),
			platform: t.Enum(
				{
					tiktok: "tiktok",
					x: "x",
					instagram: "instagram",
					youtube: "youtube",
					other: "other",
				},
				{ error: "Platform must be one of: tiktok, x, instagram, youtube, other" }
			),
			isTimeBound: t.Boolean({
				error: "isTimeBound must be a boolean",
			}),
			// Enhanced optional fields
			taskType: t.Optional(t.Enum(
				{
					follow: "follow",
					post: "post",
					like: "like",
					share: "share",
					comment: "comment",
					subscribe: "subscribe",
					other: "other",
				},
				{ error: "taskType must be one of: follow, post, like, share, comment, subscribe, other" }
			)),
			requirements: t.Optional(t.Object({
				url: t.Optional(t.String({ error: "URL must be a string" })),
				hashtags: t.Optional(t.Array(t.String({ error: "Each hashtag must be a string" }), {
					error: "Hashtags must be an array of strings"
				})),
				mentions: t.Optional(t.Array(t.String({ error: "Each mention must be a string" }), {
					error: "Mentions must be an array of strings"
				})),
				content: t.Optional(t.String({ error: "Content must be a string" })),
				keywords: t.Optional(t.Array(t.String({ error: "Each keyword must be a string" }), {
					error: "Keywords must be an array of strings"
				})),
				minLength: t.Optional(t.Number({ error: "minLength must be a number" })),
				maxLength: t.Optional(t.Number({ error: "maxLength must be a number" })),
				minFollowers: t.Optional(t.Number({ error: "minFollowers must be a number" })),
				maxFollowers: t.Optional(t.Number({ error: "maxFollowers must be a number" })),
				mediaRequired: t.Optional(t.Boolean({ error: "mediaRequired must be a boolean" })),
				engagement: t.Optional(t.Object({
					likes: t.Optional(t.Number({ error: "Likes must be a number" })),
					comments: t.Optional(t.Number({ error: "Comments must be a number" })),
					shares: t.Optional(t.Number({ error: "Shares must be a number" })),
				})),
				duration: t.Optional(t.Number({ error: "Duration must be a number in minutes" })),
				location: t.Optional(t.String({ error: "Location must be a string" })),
				language: t.Optional(t.String({ error: "Language must be a string" })),
				customFields: t.Optional(t.Record(t.String(), t.Any())),
			}, {
				error: "Requirements must be a valid object"
			})),
			verification: t.Optional(t.Object({
				method: t.Optional(t.Enum(
					{
						automatic: "automatic",
						manual: "manual",
						hybrid: "hybrid",
					},
					{ error: "Verification method must be one of: automatic, manual, hybrid" }
				)),
				checkType: t.Optional(t.Enum(
					{
						follow_status: "follow_status",
						recent_posts: "recent_posts",
						specific_post: "specific_post",
						engagement: "engagement",
						content_match: "content_match",
						hashtag_match: "hashtag_match",
						mention_match: "mention_match",
					},
					{ error: "checkType must be one of: follow_status, recent_posts, specific_post, engagement, content_match, hashtag_match, mention_match" }
				)),
				criteria: t.Optional(t.Object({
					followCheck: t.Optional(t.Boolean({ error: "followCheck must be a boolean" })),
					contentMatch: t.Optional(t.Boolean({ error: "contentMatch must be a boolean" })),
					hashtagMatch: t.Optional(t.Boolean({ error: "hashtagMatch must be a boolean" })),
					mentionMatch: t.Optional(t.Boolean({ error: "mentionMatch must be a boolean" })),
					engagementThreshold: t.Optional(t.Number({ error: "engagementThreshold must be a number" })),
					timeWindow: t.Optional(t.Number({ error: "timeWindow must be a number" })),
				})),
				timeWindow: t.Optional(t.Number({ error: "timeWindow must be a number in hours" })),
				strictMode: t.Optional(t.Boolean({ error: "strictMode must be a boolean" })),
				requiresHashtag: t.Optional(t.String({ error: "requiresHashtag must be a string" })),
				requiresMention: t.Optional(t.String({ error: "requiresMention must be a string" })),
				customRules: t.Optional(t.Array(t.String(), { error: "customRules must be an array of strings" })),
			}, {
				error: "Verification must be a valid object"
			})),
		}),
	},
	getTasks: {
		// No body validation needed for GET request
	},
	joinTask: {
		params: t.Object({
			taskId: t.String({ error: "Task ID is required and must be a string" })
		})
	},
	verifyTask: {
		params: t.Object({
			taskId: t.String({ error: "Task ID is required and must be a string" })
		})
	},
	socialUsername: {
		query: t.Object({
			platform: t.String({ error: "Platform is required and must be a string" }),
			username: t.String({ error: "Username is required and must be a string" })
		})
	}
}

export default TaskValidator
