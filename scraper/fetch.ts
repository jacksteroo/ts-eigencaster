import axios from 'axios'
import { Cast, Follow, Profile } from '../types'

/**
 * Fetch profiles from discove.xyz
*/
export const getProfiles = async (offset: number, limit: number): Promise<Profile[]> => {
	const res = await queryDiscove(`select * from profiles order by registered_at limit ${limit} offset ${offset}`)
	const profiles: Profile[] = res.data.feed.results.map((r: Record<string, any>) => {
		return {
			fid: r.fid,
			address: r.address,
			username: r.username,
			displayName: r.display_name,
			avatarUrl: r.avatar_url,
			avatarVerified: r.avatar_verified,
			followers: r.followers || 0,
			following: r.following || 0,
			bio: r.bio,
			telegram: r.telegram || null,
			referrer: r.referrer || null,
			connectedAddress: r.connected_address,
			registeredAt: new Date(r.registered_at),
			updatedAt: new Date(r.updated_at),
			customMetrics: r.custom_metrics
		}
	})

	return profiles
}

/**
 * Fetch casts from discove.xyz
 */
export const getCasts = async (offset: number, limit: number): Promise<Cast[]> => {
	const res = await queryDiscove(`select * from casts limit ${limit} offset ${offset}`)
	const casts: Cast[] = res.data.feed.results.map((r: Record<string, any>) => {
		return {
			sequence: r.sequence,
			address: r.address,
			username: r.username,
			text: r.text,
			displayName: r.display_name,
			publishedAt: r.published_at,
			avatarUrl: r.avatar_url,
			avatarVerified: r.avatar_verified,
			replyParentMerkleRoot: r.reply_parent_merkle_root,
			numReplyChildren: r.num_reply_children,
			replyParentUsername: r.reply_parent_username,
			merkleRoot: r.merkle_root,
			threadMerkleRoot: r.thread_merkle_root,
			reactions: r.reactions || 0,
			recasts: r.recasts || 0,
			watches: r.watches || 0,
			mentions: r.mentions || [],
		} as Cast
	})

	return casts
}

export const getFollows = async (offset: number, limit: number): Promise<Follow[]> => {
	const res = await queryDiscove(`select * from following limit ${limit} offset ${offset}`)
	const casts = res.data.feed.results.map((r: Record<string, any>) => {
		return {
			followerFid: r.follower_fid,
			followingFid: r.following_fid,
			createdAt: new Date(r.created_at)
		} as Follow
	})

	return casts
}

export const queryFarcaster = async (endpoint: string) => {
	const BASE_URL = 'https://api.farcaster.xyz/v1'
	const res = await axios.get(`${BASE_URL}${endpoint}`)
	return res.data
}

export const queryDiscove = async (sql: string) => {
	const BASE_URL = 'https://www.discove.xyz/api/feeds'
	const res = await axios.get(`${BASE_URL}?sql=${sql}`)
	return res
}