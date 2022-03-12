export type FollowerInfo = {
  id: number;
  username: string;
  full_name: string;
  is_private: boolean;
  profile_pic_url: string;
  follower_count?: number;
  following_count?: number;
  media_count?: number;
  biography?: string;
  is_business?: boolean;
};

// Instagram API Response Type
export type IGUser = {
  pk: number;
  username: string;
  full_name: string;
  is_private: boolean;
  profile_pic_url: string;
  profile_pic_id: string;
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
  media_count: number;
  biography: string;
  is_business: boolean;
}

export type IGUserInfoResponseData = {
  user: IGUserProfile;
  status: string;
};

export type IGUsernameResponseData = {
  graphql: {
    user: {
      biography: string;
      edge_follow: { count: number };
      edge_followed_by: { count: number };
      full_name: string;
      id: string;
      profile_pic_url: string;
      profile_pic_url_hd: string;
      username: string;
    };
    logging_page_id: string;
  };
};
