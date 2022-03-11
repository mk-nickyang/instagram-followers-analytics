export type FollowerInfo = {
  id: number;
  username: string;
  full_name: string;
  is_private: boolean;
  profile_pic_url: string;
  follower_count?: number;
  following_count?: number;
};

// Instagram API Response Type
export type IGUser = {
  pk: number;
  username: string;
  full_name: string;
  is_private: boolean;
  profile_pic_url: string;
};

export type IGFollowersResponseData = {
  users: IGUser[];
  big_list: boolean;
  page_size: number;
  next_max_id?: string;
  should_limit_list_of_followers: boolean;
  status: string;
};

export interface IGUserProfile extends IGUser {
  follower_count: number;
  following_count: number;
}

export type IGUserInfoResponseData = {
  user: IGUserProfile;
  status: string;
};
