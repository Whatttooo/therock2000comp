import type { Song } from "./rock2000songs";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  songs: Song[];
  points: number;
  numberOfSongsPlayed: number;
};

type PreRenderUser = Omit<User, "points" | "numberOfSongsPlayed">;

export const RvwSongs: Song[] = [
  {
    SONG: "Bullet With Butterfly Wings",
    ARTIST: "Smashing Pumpkins",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/bullet_with_butterfly_wings_400_smashing_pumpkins.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Dark Necessities",
    ARTIST: "Red Hot Chili Peppers",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/dark_necessities_400_red_hot_chili_peppers.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 476,
    POINTS: 1524,
  },
  {
    SONG: "Gone Away",
    ARTIST: "The Offspring",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/gone_away_400_the_offspring.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "The Sound Of Silence",
    ARTIST: "Disturbed",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_sound_of_silence_400_disturbed.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Safari Song",
    ARTIST: "Greta Van Fleet",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/safari_song_400_greta_van_fleet.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 788,
    POINTS: 1212,
  },
  {
    SONG: "Everlong",
    ARTIST: "Foo Fighters",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/everlong_400_foo_fighters.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Who Wants To Live Forever",
    ARTIST: "Queen",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/who_wants_to_live_forever_400_queen.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1217,
    POINTS: 783,
  },
  {
    SONG: "When I Come Around",
    ARTIST: "Green Day",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/when_i_come_around_400_green_day.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 714,
    POINTS: 1286,
  },
  {
    SONG: "Wish You Were Here",
    ARTIST: "Pink Floyd",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/wish_you_were_here_400_pink_floyd.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Hysteria",
    ARTIST: "Muse",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/hysteria_400_muse.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 660,
    POINTS: 1340,
  },
  {
    SONG: "Say It Ain't So",
    ARTIST: "Weezer",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/say_it_ain_t_so_400_weezer.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Black Hole Sun",
    ARTIST: "Soundgarden",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/black_hole_sun_400_soundgarden.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "One",
    ARTIST: "Metallica",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/one_400_metallica.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Fade To Black",
    ARTIST: "Metallica",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/fade_to_black_400_metallica.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Something In The Way",
    ARTIST: "Nirvana",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/something_in_the_way_400_nirvana.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "War Pigs",
    ARTIST: "Black Sabbath",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/war_pigs_400_black_sabbath.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Epic",
    ARTIST: "Faith No More",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/epic_400_faith_no_more.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Stairway To Heaven",
    ARTIST: "Led Zeppelin",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/stairway_to_heaven_400_led_zeppelin.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Patience",
    ARTIST: "Guns 'N' Roses",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/patience_400_guns_n_roses.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Riders On The Storm",
    ARTIST: "The Doors",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/riders_on_the_storm_400_the_doors.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 419,
    POINTS: 1581,
  },
];

export const KateSongs: Song[] = [
  {
    SONG: "Hey You",
    ARTIST: "Disturbed",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/hey_you_400_disturbed.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 532,
    POINTS: 1468,
  },
  {
    SONG: "Down With The Sickness",
    ARTIST: "Disturbed",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/down_with_the_sickness_400_disturbed.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Start Me Up",
    ARTIST: "The Rolling Stones",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/start_me_up_400_the_rolling_stones.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 964,
    POINTS: 1036,
  },
  {
    SONG: "Mmm Mmm Mmm",
    ARTIST: "Crash Test Dummies",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/mmm_mmm_mmm_400_crash_test_dummies.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1907,
    POINTS: 93,
  },
  {
    SONG: "Patience",
    ARTIST: "Chris Cornell",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/patience_400_chris_cornell.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "My Name Is Human",
    ARTIST: "Highly Suspect",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/my_name_is_human_400_highly_suspect.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Waiting On A War",
    ARTIST: "Foo Fighters",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/waiting_on_a_war_400_foo_fighters.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 975,
    POINTS: 1025,
  },
  {
    SONG: "Tonight",
    ARTIST: "Blindspott",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/tonight_400_blindspott.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Praise You",
    ARTIST: "Fat Boy Slim",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/praise_you_400_fat_boy_slim.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Only Love Can Save Me Now",
    ARTIST: "The Pretty Reckless",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/only_love_can_save_me_now_400_the_pretty_reckless.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1444,
    POINTS: 556,
  },
  {
    SONG: "Nobody Wants To Die",
    ARTIST: "Rival Sons",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/nobody_wants_to_die_400_rival_sons.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Zephyr Song",
    ARTIST: "Red Hot Chili Peppers",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/zephyr_song_400_red_hot_chili_peppers.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 607,
    POINTS: 1393,
  },
  {
    SONG: "Under The Bridge",
    ARTIST: "Red Hot Chili Peppers",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/under_the_bridge_400_red_hot_chili_peppers.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Bitter Sweet Symphony",
    ARTIST: "The Verve",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/bitter_sweet_symphony_400_the_verve.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 724,
    POINTS: 1276,
  },
  {
    SONG: "Everlong",
    ARTIST: "Foo Fighters",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/everlong_400_foo_fighters.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Black",
    ARTIST: "Pearl Jam",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/black_400_pearl_jam.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Bohemian Rhapsody",
    ARTIST: "Queen",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/bohemian_rhapsody_400_queen.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Chop Suey",
    ARTIST: "System Of A Down",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/chop_suey_400_system_of_a_down.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Smells Like Teen Spirit",
    ARTIST: "Nirvana",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/smells_like_teen_spirit_400_nirvana.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Stairway To Heaven",
    ARTIST: "Led Zeppelin",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/stairway_to_heaven_400_led_zeppelin.jpg?width=400&height=400&crop=auto",
  },
];

export const JamieSongs: Song[] = [
  {
    SONG: "Doomsday",
    ARTIST: "Architects",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/doomsday_400_architects.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Bloodline",
    ARTIST: "Northlane",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/bloodline_400_northlane.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Marianas Trench",
    ARTIST: "August Burns Red",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/marianas_trench_400_august_burns_red.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Ocean Planet",
    ARTIST: "Gojira",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/ocean_planet_400_gojira.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Sword In Mouth, Fire Eyes",
    ARTIST: "Norma Jean",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/sword_in_mouth_fire_eyes_400_norma_jean.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Black Flame",
    ARTIST: "Bury Tomorrow",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/black_flame_400_bury_tomorrow.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "The End Of All We Know",
    ARTIST: "Bleed From Within",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_end_of_all_we_know_400_bleed_from_within.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Pressure Point",
    ARTIST: "The Ghost Inside",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/pressure_point_400_the_ghost_inside.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Ultraviolet",
    ARTIST: "Fallujah",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/ultraviolet_400_fallujah.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Creep",
    ARTIST: "Alpha Wolf",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/creep_400_alpha_wolf.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "New Gods",
    ARTIST: "Thy Art Is Murder",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/new_gods_400_thy_art_is_murder.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Break Those Bones Whose Sinews Gave It Motion",
    ARTIST: "Meshuggah",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/break_those_bones_whose_sinews_gave_it_motion_400_meshuggah.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Leviathan",
    ARTIST: "Monuments",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/leviathan_400_monuments.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Kai Tangata",
    ARTIST: "Alien Weaponry",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/kai_tangata_400_alien_weaponry.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Hollowed Heart",
    ARTIST: "Make Them Suffer",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/hollowed_heart_400_make_them_suffer.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "The Accursed",
    ARTIST: "Born Of Osiris",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_accursed_400_born_of_osiris.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Sober",
    ARTIST: "Tool",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/sober_400_tool.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Gods",
    ARTIST: "Sleep Token",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/gods_400_sleep_token.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Vivid",
    ARTIST: "Sikth",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/vivid_400_sikth.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Matriarch",
    ARTIST: "The Black Dahlia Murder",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/matriarch_400_the_black_dahlia_murder.jpg?width=400&height=400&crop=auto",
  },
];

export const JakubSongs: Song[] = [
  {
    SONG: "Killing In The Name",
    ARTIST: "Rage Against The Machine",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/killing_in_the_name_400_rage_against_the_machine.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Freak On A Leash",
    ARTIST: "Korn",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/freak_on_a_leash_400_korn.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "The Pot",
    ARTIST: "Tool",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_pot_400_tool.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "#41",
    ARTIST: "Dave Matthews Band",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "Deep",
    ARTIST: "Anathena",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "Heart it races",
    ARTIST: "Architecture in Helsinki",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "Come Together",
    ARTIST: "The Beatles",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/come_together_400_the_beatles.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 773,
    POINTS: 1227,
  },
  {
    SONG: "Lonely Boy",
    ARTIST: "The Black Keys",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/lonely_boy_400_the_black_keys.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 667,
    POINTS: 1333,
  },
  {
    SONG: "The Last Day of Summer",
    ARTIST: "The Cure",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "Wish You Were Here",
    ARTIST: "Pink Floyd",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/wish_you_were_here_400_pink_floyd.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Fool In The Rain",
    ARTIST: "Led Zeppelin",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/fool_in_the_rain_400_led_zeppelin.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1676,
    POINTS: 324,
  },
  {
    SONG: "Since I've Been Loving You",
    ARTIST: "Led Zeppelin",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/since_i_ve_been_loving_you_400_led_zeppelin.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 966,
    POINTS: 1034,
  },
  {
    SONG: "The Evil That Men Do",
    ARTIST: "Iron Maiden",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_evil_that_men_do_400_iron_maiden.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1205,
    POINTS: 795,
  },
  {
    SONG: "Every You, Every Me",
    ARTIST: "Placebo",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/every_you_every_me_400_placebo.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1339,
    POINTS: 661,
  },
  {
    SONG: "All Mine",
    ARTIST: "Portishead",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "Exit Music (For a Film)",
    ARTIST: "Radiohead",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "Do It Again",
    ARTIST: "Steely Dan",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/do_it_again_400_steely_dan.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Sugar",
    ARTIST: "System Of A Down",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "Marquee Moon",
    ARTIST: "Television",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "Ain't Talkin' 'bout Love",
    ARTIST: "Van Halen",
    ARTWORK:
      "https://images.mediaworks.nz/radio/song/images/ain_t_talkin_bout_love_400_van_halen.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1474,
    POINTS: 526,
  },
];

export const CaiqueSongs: Song[] = [
  {
    SONG: "Chop Suey",
    ARTIST: "System Of A Down",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/chop_suey_400_system_of_a_down.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Duality",
    ARTIST: "Slipknot",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/duality_400_slipknot.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Tears Don't Fall",
    ARTIST: "Bullet for my Valentine",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/tears_don_t_fall_400_bullet_for_my_valentine.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1838,
    POINTS: 162,
  },
  {
    SONG: "Toxicity",
    ARTIST: "System Of A Down",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/toxicity_400_system_of_a_down.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Twisted Transistor",
    ARTIST: "Korn",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/twisted_transistor_400_korn.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "So Cold",
    ARTIST: "Breaking Benjamin",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/so_cold_400_breaking_benjamin.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "The Diary Of Jane",
    ARTIST: "Breaking Benjamin",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_diary_of_jane_400_breaking_benjamin.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "I Hate Everything About You",
    ARTIST: "Three Days Grace",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/i_hate_everything_about_you_400_three_days_grace.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 355,
    POINTS: 1645,
  },
  {
    SONG: "In Too Deep",
    ARTIST: "Sum 41",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/in_too_deep_400_sum_41.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1160,
    POINTS: 840,
  },
  {
    SONG: "The Kids Aren't Alright",
    ARTIST: "The Offspring",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_kids_aren_t_alright_400_the_offspring.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Hail To The King",
    ARTIST: "Avenged Sevenfold",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/hail_to_the_king_400_avenged_sevenfold.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Down With The Sickness",
    ARTIST: "Disturbed",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/down_with_the_sickness_400_disturbed.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Saviour",
    ARTIST: "Rise Against",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/saviour_400_rise_against.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Kai Tangata",
    ARTIST: "Alien Weaponry",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/kai_tangata_400_alien_weaponry.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Open Your Eyes",
    ARTIST: "Alter Bridge",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/open_your_eyes_400_alter_bridge.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Higher",
    ARTIST: "Creed",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/higher_400_creed.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Last Resort",
    ARTIST: "Papa Roach",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/last_resort_400_papa_roach.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Bodies",
    ARTIST: "Drowning Pool",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/bodies_400_drowning_pool.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "My Curse",
    ARTIST: "Killswitch Engage",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/my_curse_400_killswitch_engage.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 412,
    POINTS: 1588,
  },
  {
    SONG: "Fallen Leaves",
    ARTIST: "Billy Talent",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/fallen_leaves_400_billy_talent.jpg?width=400&height=400&crop=auto",
  },
];

export const LauraSongs: Song[] = [
  {
    SONG: "Love?",
    ARTIST: "Strapping Young Lad",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/love__400_strapping_young_lad.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Twilight Of The Thunder God",
    ARTIST: "Amon Amarth",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/twilight_of_the_thunder_god_400_amon_amarth.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Cigaro",
    ARTIST: "System Of A Down",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/cigaro_400_system_of_a_down.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 984,
    POINTS: 1016,
  },
  {
    SONG: "Lateralus",
    ARTIST: "Tool",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/lateralus_400_tool.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Raining Blood",
    ARTIST: "Slayer",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/raining_blood_400_slayer.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "The Trooper",
    ARTIST: "Iron Maiden",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_trooper_400_iron_maiden.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Bones",
    ARTIST: "Vader",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/bones_400_vader.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Roots Bloody Roots",
    ARTIST: "Sepultura",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/roots_bloody_roots_400_sepultura.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 896,
    POINTS: 1104,
  },
  {
    SONG: "Puritania",
    ARTIST: "Dimmu Borgir",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/puritania_400_dimmu_borgir.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Smooth Sailing",
    ARTIST: "Queens Of The Stone Age",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/smooth_sailing_400_queens_of_the_stone_age.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 732,
    POINTS: 1268,
  },
  {
    SONG: "Dragula",
    ARTIST: "Rob Zombie",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/dragula_400_rob_zombie.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Hyperdrive",
    ARTIST: "Devin Townsend",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/hyperdrive_400_devin_townsend.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Three Libras",
    ARTIST: "A Perfect Circle",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/three_libras_400_a_perfect_circle.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Heart Shaped Box",
    ARTIST: "Nirvana",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/heart_shaped_box_400_nirvana.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "No One Knows",
    ARTIST: "Queens Of The Stone Age",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/no_one_knows_400_queens_of_the_stone_age.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Bohemian Rhapsody",
    ARTIST: "Queen",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/bohemian_rhapsody_400_queen.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Paranoid",
    ARTIST: "Black Sabbath",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/paranoid_400_black_sabbath.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Where Is My Mind",
    ARTIST: "The Pixies",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/where_is_my_mind_400_the_pixies.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 371,
    POINTS: 1629,
  },
  {
    SONG: "Bullet With Butterfly Wings",
    ARTIST: "Smashing Pumpkins",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/bullet_with_butterfly_wings_400_smashing_pumpkins.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Father Of The Wolf",
    ARTIST: "Amon Amarth",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/father_of_the_wolf_400_amon_amarth.jpg?width=400&height=400&crop=auto",
  },
];

export const BrendonSongs: Song[] = [
  {
    SONG: "One",
    ARTIST: "Metallica",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/one_400_metallica.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Nil By Mouth",
    ARTIST: "Blindspott",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/nil_by_mouth_400_blindspott.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Free Bird",
    ARTIST: "Lynyrd Skynyrd",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/free_bird_400_lynyrd_skynyrd.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Forty Six & 2",
    ARTIST: "Tool",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/forty_six_2_400_tool.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "The Pot",
    ARTIST: "Tool",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_pot_400_tool.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Everlong",
    ARTIST: "Foo Fighters",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/everlong_400_foo_fighters.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "All My Life",
    ARTIST: "Foo Fighters",
    ARTWORK:
      "https://images.mediaworks.nz/radio/song/images/all_my_life_400_foo_fighters.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Paradise City",
    ARTIST: "Guns 'N' Roses",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/paradise_city_400_guns_n_roses.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Chop Suey",
    ARTIST: "System Of A Down",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/chop_suey_400_system_of_a_down.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Smells Like Teen Spirit",
    ARTIST: "Nirvana",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/smells_like_teen_spirit_400_nirvana.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Iron Man",
    ARTIST: "Black Sabbath",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/iron_man_400_black_sabbath.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "War Pigs",
    ARTIST: "Black Sabbath",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/war_pigs_400_black_sabbath.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "For Those About To Rock (We Salute You)",
    ARTIST: "AC/DC",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/for_those_about_to_rock_we_salute_you__400_ac_dc.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Home Again",
    ARTIST: "Shihad",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/home_again_400_shihad.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Killing In The Name",
    ARTIST: "Rage Against The Machine",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/killing_in_the_name_400_rage_against_the_machine.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Black",
    ARTIST: "Pearl Jam",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/black_400_pearl_jam.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "The Sound Of Silence",
    ARTIST: "Disturbed",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_sound_of_silence_400_disturbed.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "My Name Is Human",
    ARTIST: "Highly Suspect",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/my_name_is_human_400_highly_suspect.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "November Rain",
    ARTIST: "Guns 'N' Roses",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/november_rain_400_guns_n_roses.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Enter Sandman",
    ARTIST: "Metallica",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/enter_sandman_400_metallica.jpg?width=400&height=400&crop=auto",
  },
];

export const JoshSongs: Song[] = [
  {
    SONG: "Killing In The Name",
    ARTIST: "Rage Against The Machine",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/killing_in_the_name_400_rage_against_the_machine.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Tiny Little Island",
    ARTIST: "Villainy",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/tiny_little_island_400_villainy.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1736,
    POINTS: 264,
  },
  {
    SONG: "Bohemian Rhapsody",
    ARTIST: "Queen",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/bohemian_rhapsody_400_queen.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "My Hero",
    ARTIST: "Foo Fighters",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/my_hero_400_foo_fighters.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "For Whom The Bell Tolls",
    ARTIST: "Metallica",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/for_whom_the_bell_tolls_400_metallica.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Free Bird",
    ARTIST: "Lynyrd Skynyrd",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/free_bird_400_lynyrd_skynyrd.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Daughter",
    ARTIST: "Pearl Jam",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/daughter_400_pearl_jam.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Thunderstruck",
    ARTIST: "AC/DC",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/thunderstruck_400_ac_dc.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Papercut",
    ARTIST: "Linkin Park",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/papercut_400_linkin_park.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "The Chain",
    ARTIST: "Fleetwood Mac",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_chain_400_fleetwood_mac.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Tribute",
    ARTIST: "Tenacious D",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/tribute_400_tenacious_d.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Hotel California",
    ARTIST: "The Eagles",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/hotel_california_400_the_eagles.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "How You Remind Me",
    ARTIST: "Nickelback",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/how_you_remind_me_400_nickelback.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Do I Wanna Know",
    ARTIST: "Arctic Monkeys",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/do_i_wanna_know_400_arctic_monkeys.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "The Diary Of Jane",
    ARTIST: "Breaking Benjamin",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_diary_of_jane_400_breaking_benjamin.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Indestructible",
    ARTIST: "Disturbed",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/indestructible_400_disturbed.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 682,
    POINTS: 1318,
  },
  {
    SONG: "Hail To The King",
    ARTIST: "Avenged Sevenfold",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/hail_to_the_king_400_avenged_sevenfold.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Start A Revolution",
    ARTIST: "Devilskin",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/start_a_revolution_400_devilskin.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Last Resort",
    ARTIST: "Papa Roach",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/last_resort_400_papa_roach.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Seven Nation Army",
    ARTIST: "The White Stripes",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/seven_nation_army_400_the_white_stripes.jpg?width=400&height=400&crop=auto",
  },
];

export const BrendonFootballSongs: Song[] = [
  {
    SONG: "Still Waiting",
    ARTIST: "Sum 41",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/still_waiting_400_sum_41.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Run",
    ARTIST: "Shihad",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/run_400_shihad.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 356,
    POINTS: 1644,
  },
  {
    SONG: "Anna Molly",
    ARTIST: "Incubus",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/anna_molly_400_incubus.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1258,
    POINTS: 742,
  },
  {
    SONG: "The Rock Show",
    ARTIST: "Blink 182",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_rock_show_400_blink_182.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 721,
    POINTS: 1279,
  },
  {
    SONG: "The River",
    ARTIST: "Good Charlotte",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_river_400_good_charlotte.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Aerials",
    ARTIST: "System Of A Down",
    ARTWORK:
      "https://images.mediaworks.nz/radio/song/images/aerials_400_system_of_a_down.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "The Pretender",
    ARTIST: "Foo Fighters",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_pretender_400_foo_fighters.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Under The Bridge",
    ARTIST: "Red Hot Chili Peppers",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/under_the_bridge_400_red_hot_chili_peppers.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Livin' On A Prayer",
    ARTIST: "Bon Jovi",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/livin_on_a_prayer_400_bon_jovi.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Want You Bad",
    ARTIST: "The Offspring",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/want_you_bad_400_the_offspring.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1191,
    POINTS: 809,
  },
  {
    SONG: "Santa Monica",
    ARTIST: "Everclear",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/santa_monica_400_everclear.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 514,
    POINTS: 1486,
  },
  {
    SONG: "Prayer of the Refugee",
    ARTIST: "Rise Against",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/prayer_of_the_refugee_400_rise_against.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1329,
    POINTS: 671,
  },
  {
    SONG: "Uprising",
    ARTIST: "Muse",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/uprising_400_muse.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 558,
    POINTS: 1442,
  },
  {
    SONG: "Room To Breathe",
    ARTIST: "Blindspott",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/room_to_breathe_400_blindspott.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Lay Down Your Guns",
    ARTIST: "Jimmy Barnes",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/lay_down_your_guns_400_jimmy_barnes.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1015,
    POINTS: 985,
  },
  {
    SONG: "Got The Life",
    ARTIST: "Korn",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/got_the_life_400_korn.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Faint",
    ARTIST: "Linkin Park",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/faint_400_linkin_park.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Basket Case",
    ARTIST: "Green Day",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/basket_case_400_green_day.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 395,
    POINTS: 1605,
  },
  {
    SONG: "What's The Story Morning Glory?",
    ARTIST: "Oasis",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/what_s_the_story_morning_glory__400_oasis.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 673,
    POINTS: 1327,
  },
  {
    SONG: "Killing In The Name",
    ARTIST: "Rage Against The Machine",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/killing_in_the_name_400_rage_against_the_machine.jpg?width=400&height=400&crop=auto",
  },
];

export const NinaSongs: Song[] = [
  {
    SONG: "I Love Rock 'n' Roll",
    ARTIST: "Joan Jett",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/i_love_rock_n_roll_400_joan_jett.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 907,
    POINTS: 1093,
  },
  {
    SONG: "Hey You",
    ARTIST: "Disturbed",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/hey_you_400_disturbed.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 532,
    POINTS: 1468,
  },
  {
    SONG: "Vessel",
    ARTIST: "Devilskin",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/vessel_400_devilskin.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "The Kill",
    ARTIST: "30 Seconds To Mars",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_kill_400_30_seconds_to_mars.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Spoonman",
    ARTIST: "Soundgarden",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/spoonman_400_soundgarden.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 384,
    POINTS: 1616,
  },
  {
    SONG: "Show Me How To Live",
    ARTIST: "Audioslave",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/show_me_how_to_live_400_audioslave.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Change (In The House Of Flies)",
    ARTIST: "Deftones",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/change_in_the_house_of_flies__400_deftones.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Killing In The Name",
    ARTIST: "Rage Against The Machine",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/killing_in_the_name_400_rage_against_the_machine.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Blackbird",
    ARTIST: "Alter Bridge",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "White Limo",
    ARTIST: "Foo Fighters",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/white_limo_400_foo_fighters.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1623,
    POINTS: 377,
  },
  {
    SONG: "Negative Creep",
    ARTIST: "Nirvana",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "What went down",
    ARTIST: "Foals",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "Negative Space",
    ARTIST: "Queens Of The Stone Age",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "Hash Pipe",
    ARTIST: "Weezer",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/hash_pipe_400_weezer.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1039,
    POINTS: 961,
  },
  {
    SONG: "Can You See Me In The Dark?",
    ARTIST: "Halestorm",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "The Summoning",
    ARTIST: "Sleep Token",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "Only Happy When It Rains",
    ARTIST: "Garbage",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/only_happy_when_it_rains_400_garbage.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1826,
    POINTS: 174,
  },
  {
    SONG: "Build An Army",
    ARTIST: "Fightstar",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "Heads Will Roll",
    ARTIST: "Yeah Yeah Yeahs",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "Livin' On A Prayer",
    ARTIST: "Bon Jovi",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/livin_on_a_prayer_400_bon_jovi.jpg?width=400&height=400&crop=auto",
  },
];

export const FelicitySongs: Song[] = [
  {
    SONG: "Woman",
    ARTIST: "Wolfmother",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/woman_400_wolfmother.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 957,
    POINTS: 1043,
  },
  {
    SONG: "My Sharona",
    ARTIST: "The Knack",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/my_sharona_400_the_knack.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1710,
    POINTS: 290,
  },
  {
    SONG: "All My Life",
    ARTIST: "Foo Fighters",
    ARTWORK:
      "https://images.mediaworks.nz/radio/song/images/all_my_life_400_foo_fighters.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Barracuda",
    ARTIST: "Devilskin",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/barracuda_400_devilskin.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Blister In The Sun",
    ARTIST: "Violent Femmes",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/blister_in_the_sun_400_violent_femmes.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 877,
    POINTS: 1123,
  },
  {
    SONG: "Into The Great Wide Open",
    ARTIST: "Tom Petty and The Heartbreakers",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/into_the_great_wide_open_400_tom_petty_and_the_heartbreakers.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1500,
    POINTS: 500,
  },
  {
    SONG: "Should I Stay Or Should I Go",
    ARTIST: "The Clash",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/should_i_stay_or_should_i_go_400_the_clash.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1082,
    POINTS: 918,
  },
  {
    SONG: "S!Ck",
    ARTIST: "The Warning",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/s_ck_400_the_warning.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1547,
    POINTS: 453,
  },
  {
    SONG: "We Will Rock You",
    ARTIST: "Queen",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/we_will_rock_you_400_queen.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "New Noise",
    ARTIST: "Refused",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/new_noise_400_refused.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Just A Girl",
    ARTIST: "No Doubt",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/just_a_girl_400_no_doubt.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 704,
    POINTS: 1296,
  },
  {
    SONG: "I Love Rock 'n' Roll",
    ARTIST: "Joan Jett",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/i_love_rock_n_roll_400_joan_jett.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 907,
    POINTS: 1093,
  },
  {
    SONG: "I'll Say Goodbye (Even Though I'm Blue)",
    ARTIST: "The Exponents",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/i_ll_say_goodbye_even_though_i_m_blue__400_the_exponents.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1845,
    POINTS: 155,
  },
  {
    SONG: "No One Knows",
    ARTIST: "Queens Of The Stone Age",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/no_one_knows_400_queens_of_the_stone_age.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Another Celebration At The End Of The World",
    ARTIST: "Wolfgang Van Halen",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/another_celebration_at_the_end_of_the_world_400_wolfgang_van_halen.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1682,
    POINTS: 318,
  },
  {
    SONG: "Blackout",
    ARTIST: "Turnstile",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/blackout_400_turnstile.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 410,
    POINTS: 1590,
  },
  {
    SONG: "Dinosaur",
    ARTIST: "Theory Of A Deadman",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/dinosaur_400_theory_of_a_deadman.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 743,
    POINTS: 1257,
  },
  {
    SONG: "Drive",
    ARTIST: "Incubus",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/drive_400_incubus.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Iron Man",
    ARTIST: "Black Sabbath",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/iron_man_400_black_sabbath.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "She's A Genius",
    ARTIST: "Jet",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/she_s_a_genius_400_jet.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1431,
    POINTS: 569,
  },
];

export const MattSongs: Song[] = [
  {
    SONG: "Whole Lotta Rosie",
    ARTIST: "AC/DC",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/whole_lotta_rosie_400_ac_dc.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "New California",
    ARTIST: "Highly Suspect",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/new_california_400_highly_suspect.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 603,
    POINTS: 1397,
  },
  {
    SONG: "Duality",
    ARTIST: "Slipknot",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/duality_400_slipknot.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Black Velvet",
    ARTIST: "Alannah Myles",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/black_velvet_400_alannah_myles.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1928,
    POINTS: 72,
  },
  {
    SONG: "Crack Cocaine",
    ARTIST: "Ozzy Osbourne",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/crack_cocaine_400_ozzy_osbourne.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Roots Bloody Roots",
    ARTIST: "Sepultura",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/roots_bloody_roots_400_sepultura.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 896,
    POINTS: 1104,
  },
  {
    SONG: "The Launch",
    ARTIST: "Villainy",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_launch_400_villainy.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 922,
    POINTS: 1078,
  },
  {
    SONG: "1000Hp",
    ARTIST: "Godsmack",
    ARTWORK:
      "https://images.mediaworks.nz/radio/song/images/1000hp_400_godsmack.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 490,
    POINTS: 1510,
  },
  {
    SONG: "Short Skirt/Long Jacket",
    ARTIST: "Cake",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/short_skirt_long_jacket_400_cake.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1239,
    POINTS: 761,
  },
  {
    SONG: "The Trooper",
    ARTIST: "Iron Maiden",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_trooper_400_iron_maiden.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Fuel",
    ARTIST: "Metallica",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/fuel_400_metallica.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Black Betty",
    ARTIST: "Spiderbait",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/black_betty_400_spiderbait.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 645,
    POINTS: 1355,
  },
  {
    SONG: "Don't Fear The Reaper",
    ARTIST: "Blue Oyster Cult",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/don_t_fear_the_reaper_400_blue_oyster_cult.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 463,
    POINTS: 1537,
  },
  {
    SONG: "Barracuda",
    ARTIST: "Heart",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/barracuda_400_heart.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 700,
    POINTS: 1300,
  },
  {
    SONG: "La Grange",
    ARTIST: "ZZ Top",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/la_grange_400_zz_top.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Sweating Bullets",
    ARTIST: "Megadeth",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/sweating_bullets_400_megadeth.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1499,
    POINTS: 501,
  },
  {
    SONG: "Jesus Built My Hotrod",
    ARTIST: "Ministry",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/jesus_built_my_hotrod_400_ministry.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Cowboys From Hell",
    ARTIST: "Pantera",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/cowboys_from_hell_400_pantera.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Ace Of Spades",
    ARTIST: "Motorhead",
    ARTWORK:
      "https://images.mediaworks.nz/radio/song/images/ace_of_spades_400_motorhead.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Ruby Soho",
    ARTIST: "Rancid",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/ruby_soho_400_rancid.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1134,
    POINTS: 866,
  },
];

export const MichaelSongs: Song[] = [
  {
    SONG: "Nowhere To Run",
    ARTIST: "Iconic",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  },
  {
    SONG: "Natural Born Killer",
    ARTIST: "Highly Suspect",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/natural_born_killer_400_highly_suspect.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Boilermaker",
    ARTIST: "Royal Blood",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/boilermaker_400_royal_blood.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1006,
    POINTS: 994,
  },
  {
    SONG: "Home Again",
    ARTIST: "Shihad",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/home_again_400_shihad.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "I Believe In A Thing Called Love",
    ARTIST: "The Darkness",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/i_believe_in_a_thing_called_love_400_the_darkness.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 794,
    POINTS: 1206,
  },
  {
    SONG: "Mr Brightside",
    ARTIST: "The Killers",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/mr_brightside_400_the_killers.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "War Pigs",
    ARTIST: "Black Sabbath",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/war_pigs_400_black_sabbath.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Place Your Hands",
    ARTIST: "Reef",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/place_your_hands_400_reef.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Nice To Know You",
    ARTIST: "Incubus",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/nice_to_know_you_400_incubus.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 851,
    POINTS: 1149,
  },
  {
    SONG: "The Joker And The Thief",
    ARTIST: "Wolfmother",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_joker_and_the_thief_400_wolfmother.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Bitter Sweet Symphony",
    ARTIST: "The Verve",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/bitter_sweet_symphony_400_the_verve.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 724,
    POINTS: 1276,
  },
  {
    SONG: "Black Dog",
    ARTIST: "Led Zeppelin",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/black_dog_400_led_zeppelin.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Thunderstruck",
    ARTIST: "AC/DC",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/thunderstruck_400_ac_dc.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Champagne Supernova",
    ARTIST: "Oasis",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/champagne_supernova_400_oasis.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 409,
    POINTS: 1591,
  },
  {
    SONG: "Charmless Man",
    ARTIST: "Blur",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/charmless_man_400_blur.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Where Did You Sleep Last Night",
    ARTIST: "Nirvana",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/where_did_you_sleep_last_night_400_nirvana.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Basket Case",
    ARTIST: "Green Day",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/basket_case_400_green_day.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 395,
    POINTS: 1605,
  },
  {
    SONG: "Shout At The Devil",
    ARTIST: "Motley Crue",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/shout_at_the_devil_400_motley_crue.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 1141,
    POINTS: 859,
  },
  {
    SONG: "Seven Nation Army",
    ARTIST: "The White Stripes",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/seven_nation_army_400_the_white_stripes.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Paradise City",
    ARTIST: "Guns 'N' Roses",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/paradise_city_400_guns_n_roses.jpg?width=400&height=400&crop=auto",
  },
];

export const CharlieSongs: Song[] = [
  {
    SONG: "Run",
    ARTIST: "Shihad",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/run_400_shihad.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 356,
    POINTS: 1644,
  },
  {
    SONG: "By The Way",
    ARTIST: "Red Hot Chili Peppers",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/by_the_way_400_red_hot_chili_peppers.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 439,
    POINTS: 1561,
  },
  {
    SONG: "Smells Like Teen Spirit",
    ARTIST: "Nirvana",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/smells_like_teen_spirit_400_nirvana.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Radioactive",
    ARTIST: "Imagine Dragons",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/radioactive_400_imagine_dragons.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 722,
    POINTS: 1278,
  },
  {
    SONG: "The Hellcat Spangled Shalalala",
    ARTIST: "Arctic Monkeys",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_hellcat_spangled_shalalala_400_arctic_monkeys.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "My Hero",
    ARTIST: "Foo Fighters",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/my_hero_400_foo_fighters.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Dinosaur",
    ARTIST: "Theory Of A Deadman",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/dinosaur_400_theory_of_a_deadman.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 743,
    POINTS: 1257,
  },
  {
    SONG: "Paradise City",
    ARTIST: "Guns 'N' Roses",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/paradise_city_400_guns_n_roses.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Natural Born Killer",
    ARTIST: "Highly Suspect",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/natural_born_killer_400_highly_suspect.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "What's My Age Again?",
    ARTIST: "Blink 182",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/what_s_my_age_again__400_blink_182.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Free Fallin'",
    ARTIST: "Tom Petty",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/free_fallin__400_tom_petty.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Bohemian Rhapsody",
    ARTIST: "Queen",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/bohemian_rhapsody_400_queen.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Fistful Of Steel",
    ARTIST: "Rage Against The Machine",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/fistful_of_steel_400_rage_against_the_machine.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "The Joker And The Thief",
    ARTIST: "Wolfmother",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/the_joker_and_the_thief_400_wolfmother.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Tribute",
    ARTIST: "Tenacious D",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/tribute_400_tenacious_d.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Under The Graveyard",
    ARTIST: "Ozzy Osbourne",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/under_the_graveyard_400_ozzy_osbourne.jpg?width=400&height=400&crop=auto",
    PLAYED_AT: 339,
    POINTS: 1661,
  },
  {
    SONG: "Iron Man",
    ARTIST: "Black Sabbath",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/iron_man_400_black_sabbath.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Everyday's A Saturday",
    ARTIST: "Elemeno P",
    ARTWORK:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
    PLAYED_AT: 1246,
    POINTS: 754,
  },
  {
    SONG: "Seven Nation Army",
    ARTIST: "The White Stripes",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/seven_nation_army_400_the_white_stripes.jpg?width=400&height=400&crop=auto",
  },
  {
    SONG: "Dark Matter",
    ARTIST: "Pearl Jam",
    ARTWORK:
      "https://images-test.mediaworks.nz/radio/song/images/dark_matter_400_pearl_jam.jpg?width=400&height=400&crop=auto",
  },
];

export const CompetitionSongEntriesSet: Set<Song> = new Set([
  ...RvwSongs,
  ...KateSongs,
  ...JamieSongs,
  ...JakubSongs,
  ...JoshSongs,
  ...CaiqueSongs,
  ...LauraSongs,
  ...BrendonSongs,
  ...BrendonFootballSongs,
  ...NinaSongs,
  ...FelicitySongs,
  ...MattSongs,
  ...MichaelSongs,
  ...CharlieSongs,
]);

export const CompetitionSongEntriesArray: Song[] = Array.from(
  CompetitionSongEntriesSet
);

export const Josh: PreRenderUser = {
  id: 1,
  firstName: "Josh",
  lastName: "Whateley",
  songs: JoshSongs,
};

export const Rvw: PreRenderUser = {
  id: 2,
  firstName: "Richard",
  lastName: "Van Wayenburg",
  songs: RvwSongs,
};

export const Jamie: PreRenderUser = {
  id: 3,
  firstName: "Jamie",
  lastName: "Penney",
  songs: JamieSongs,
};

export const Kate: PreRenderUser = {
  id: 4,
  firstName: "Kate",
  lastName: "Dear",
  songs: KateSongs,
};
export const Jakub: PreRenderUser = {
  id: 5,
  firstName: "Jakub",
  lastName: "Jurkiewicz",
  songs: JakubSongs,
};
export const Caique: PreRenderUser = {
  id: 6,
  firstName: "Caique",
  lastName: "Caleiro",
  songs: CaiqueSongs,
};
export const Laura: PreRenderUser = {
  id: 7,
  firstName: "Laura",
  lastName: "Campbell",
  songs: LauraSongs,
};
export const Brendon: PreRenderUser = {
  id: 8,
  firstName: "Brendon",
  lastName: "Wildbore",
  songs: BrendonSongs,
};
export const BrendonFootball: PreRenderUser = {
  id: 9,
  firstName: "Brendon",
  lastName: "Clarke",
  songs: BrendonFootballSongs,
};
export const Nina: PreRenderUser = {
  id: 10,
  firstName: "Nina",
  lastName: "Cook",
  songs: NinaSongs,
};
export const Felicity: PreRenderUser = {
  id: 11,
  firstName: "Felicity",
  lastName: "Hylla",
  songs: FelicitySongs,
};
export const Matt: PreRenderUser = {
  id: 12,
  firstName: "Matt",
  lastName: "Hylla",
  songs: MattSongs,
};
export const Michael: PreRenderUser = {
  id: 13,
  firstName: "Michael",
  lastName: "Prideaux",
  songs: MichaelSongs,
};
export const Charlie: PreRenderUser = {
  id: 14,
  firstName: "Charlie",
  lastName: "Prideaux",
  songs: CharlieSongs,
};

export const users: PreRenderUser[] = [
  Josh,
  Rvw,
  Jamie,
  Kate,
  Jakub,
  Caique,
  Laura,
  Brendon,
  BrendonFootball,
  Nina,
  Felicity,
  Matt,
  Michael,
  Charlie,
];
