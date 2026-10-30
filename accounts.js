/*
==========================================================
 YEN! // ECHO ACCOUNT FILE
==========================================================
This is the ONLY place you need to edit accounts.

Every object inside YEN_ACCOUNTS is a complete account template.

Available fields:
  username       login name
  password       login password
  dox            starting DOX (number OR quoted number for huge values)
  ownedSkills   Skill IDs OR exact skill names from the 8,000-skill vault
  attacks       Extra attack buttons unique to this account
  potions       Starting healing-potion counts

The basic boss attacks are supplied by the boss's own script.
Purchased/owned skills and custom attacks are added automatically.

This is intentionally a static account system. There is no server and
nothing is saved back to this file automatically.

SPECIAL SKILL IDS READY TO ASSIGN:
  "deathsringer"
  "no-saki"
  "perfect-parry"
  "k-z-x"


 {
        id: "dox-burst",
        name: "DOX BURST",
        power: 42000,
        rarity: "CUSTOM",
        color: "#ff355e",
        description: "A custom account-only attack."
      }
==========================================================
*/

window.YEN_ACCOUNTS = [
  {
    username: "Solstice",
    password: "666",
    dox: "200087200",
    ownedSkills: ["win-can-make-sword"],
    attacks: [],
    potions: {
      minor: 0,
      greater: 0
    }
  },

  {
    username: "TestACT",
    password: "678fHVGHBNhjjbhhyhuUGUYHUIGYFT",
    dox: "99999999999999999999",
    ownedSkills: ["win-can-make-sword", "trident-of-co-op","deathsringer","no-saki","perfect-parry"],
    attacks: [
  {
    id: "slap",
    name: "Salp",
    power: 1000000,
    rarity: "CUSTOM",
    color: "#ffffff",
    description: "A custom account-only attack."
  },
  {
    id: "bommber",
    name: "BOMBER",
    power: 400000,
    rarity: "CUSTOM",
    color: "#0d0085",
    description: "A custom account-only attack."
  },
  {
    id: "abyssal_decapitation",
    name: "Abyssal Decapitation",
    power: 1200000,
    rarity: "CUSTOM",
    color: "#1a0033",
    description: "A custom account-only attack."
  },
  {
    id: "aetheric_rupture",
    name: "Aetheric Rupture",
    power: 950000,
    rarity: "CUSTOM",
    color: "#00ffff",
    description: "A custom account-only attack."
  },
  {
    id: "alpha_strike_ragnarok",
    name: "Alpha Strike: Ragnarok",
    power: 2500000,
    rarity: "CUSTOM",
    color: "#ff0000",
    description: "A custom account-only attack."
  },
  {
    id: "apocalypse_drive",
    name: "Apocalypse Drive",
    power: 3000000,
    rarity: "CUSTOM",
    color: "#ff3300",
    description: "A custom account-only attack."
  },
  {
    id: "ashen_mortification",
    name: "Ashen Mortification",
    power: 850000,
    rarity: "CUSTOM",
    color: "#555555",
    description: "A custom account-only attack."
  },
  {
    id: "astral_cleave",
    name: "Astral Cleave",
    power: 1100000,
    rarity: "CUSTOM",
    color: "#4d4dff",
    description: "A custom account-only attack."
  },
  {
    id: "atom_splitter",
    name: "Atom Splitter",
    power: 1800000,
    rarity: "CUSTOM",
    color: "#33ff33",
    description: "A custom account-only attack."
  },
  {
    id: "avalanche_bash",
    name: "Avalanche Bash",
    power: 750000,
    rarity: "CUSTOM",
    color: "#e6f2ff",
    description: "A custom account-only attack."
  },
  {
    id: "black_hole_singularity",
    name: "Black Hole Singularity",
    power: 5000000,
    rarity: "CUSTOM",
    color: "#000000",
    description: "A custom account-only attack."
  },
  {
    id: "blazing_cataclysm",
    name: "Blazing Cataclysm",
    power: 1600000,
    rarity: "CUSTOM",
    color: "#ff6600",
    description: "A custom account-only attack."
  },
  {
    id: "bloodlust_execution",
    name: "Bloodlust Execution",
    power: 1400000,
    rarity: "CUSTOM",
    color: "#990000",
    description: "A custom account-only attack."
  },
  {
    id: "celestial_piercer",
    name: "Celestial Piercer",
    power: 1250000,
    rarity: "CUSTOM",
    color: "#ffff99",
    description: "A custom account-only attack."
  },
  {
    id: "chaos_bolt_oblivion",
    name: "Chaos Bolt: Oblivion",
    power: 2000000,
    rarity: "CUSTOM",
    color: "#cc00cc",
    description: "A custom account-only attack."
  },
  {
    id: "chronos_trigger",
    name: "Chronos Trigger",
    power: 1500000,
    rarity: "CUSTOM",
    color: "#ffcc00",
    description: "A custom account-only attack."
  },
  {
    id: "cosmic_impact",
    name: "Cosmic Impact",
    power: 2200000,
    rarity: "CUSTOM",
    color: "#6600ff",
    description: "A custom account-only attack."
  },
  {
    id: "crimson_overdrive",
    name: "Crimson Overdrive",
    power: 1350000,
    rarity: "CUSTOM",
    color: "#ff0055",
    description: "A custom account-only attack."
  },
  {
    id: "dark_matter_crush",
    name: "Dark Matter Crush",
    power: 2400000,
    rarity: "CUSTOM",
    color: "#1a1a1a",
    description: "A custom account-only attack."
  },
  {
    id: "demonic_decimation",
    name: "Demonic Decimation",
    power: 1900000,
    rarity: "CUSTOM",
    color: "#660000",
    description: "A custom account-only attack."
  },
  {
    id: "dimensional_tear",
    name: "Dimensional Tear",
    power: 1700000,
    rarity: "CUSTOM",
    color: "#9933ff",
    description: "A custom account-only attack."
  },
  {
    id: "divine_judgement",
    name: "Divine Judgement",
    power: 2800000,
    rarity: "CUSTOM",
    color: "#ffffcc",
    description: "A custom account-only attack."
  },
  {
    id: "doom_herald_strike",
    name: "Doom Herald Strike",
    power: 1300000,
    rarity: "CUSTOM",
    color: "#330000",
    description: "A custom account-only attack."
  },
  {
    id: "dragonic_incineration",
    name: "Dragonic Incineration",
    power: 2100000,
    rarity: "CUSTOM",
    color: "#ff3333",
    description: "A custom account-only attack."
  },
  {
    id: "eclipse_onslaught",
    name: "Eclipse Onslaught",
    power: 1650000,
    rarity: "CUSTOM",
    color: "#4a004a",
    description: "A custom account-only attack."
  },
  {
    id: "elder_sign_eradication",
    name: "Elder Sign: Eradication",
    power: 2700000,
    rarity: "CUSTOM",
    color: "#00ffcc",
    description: "A custom account-only attack."
  },
  {
    id: "elemental_tempest",
    name: "Elemental Tempest",
    power: 1550000,
    rarity: "CUSTOM",
    color: "#33ccff",
    description: "A custom account-only attack."
  },
  {
    id: "entropy_burst",
    name: "Entropy Burst",
    power: 1150000,
    rarity: "CUSTOM",
    color: "#808000",
    description: "A custom account-only attack."
  },
  {
    id: "epoch_shatter",
    name: "Epoch Shatter",
    power: 1850000,
    rarity: "CUSTOM",
    color: "#009999",
    description: "A custom account-only attack."
  },
  {
    id: "eternal_damnation",
    name: "Eternal Damnation",
    power: 2600000,
    rarity: "CUSTOM",
    color: "#220000",
    description: "A custom account-only attack."
  },
  {
    id: "event_horizon_slam",
    name: "Event Horizon Slam",
    power: 3200000,
    rarity: "CUSTOM",
    color: "#0a001a",
    description: "A custom account-only attack."
  },
  {
    id: "final_giga_flare",
    name: "Final Giga Flare",
    power: 4000000,
    rarity: "CUSTOM",
    color: "#ff9900",
    description: "A custom account-only attack."
  },
  {
    id: "frostbite_executer",
    name: "Frostbite Executer",
    power: 900000,
    rarity: "CUSTOM",
    color: "#b3f0ff",
    description: "A custom account-only attack."
  },
  {
    id: "galaxy_breaker",
    name: "Galaxy Breaker",
    power: 4500000,
    rarity: "CUSTOM",
    color: "#660099",
    description: "A custom account-only attack."
  },
  {
    id: "genesis_wave",
    name: "Genesis Wave",
    power: 3500000,
    rarity: "CUSTOM",
    color: "#ffffff",
    description: "A custom account-only attack."
  },
  {
    id: "god_slayer_impale",
    name: "God-Slayer Impale",
    power: 4800000,
    rarity: "CUSTOM",
    color: "#cc0000",
    description: "A custom account-only attack."
  },
  {
    id: "gravity_well_collapse",
    name: "Gravity Well Collapse",
    power: 2300000,
    rarity: "CUSTOM",
    color: "#1a0033",
    description: "A custom account-only attack."
  },
  {
    id: "hellfire_barrage",
    name: "Hellfire Barrage",
    power: 1450000,
    rarity: "CUSTOM",
    color: "#e60000",
    description: "A custom account-only attack."
  },
  {
    id: "hypernova_cannon",
    name: "Hypernova Cannon",
    power: 5500000,
    rarity: "CUSTOM",
    color: "#ffff33",
    description: "A custom account-only attack."
  },
  {
    id: "infinity_edge",
    name: "Infinity Edge",
    power: 5000000,
    rarity: "CUSTOM",
    color: "#d9b3ff",
    description: "A custom account-only attack."
  },
  {
    id: "judgment_day_blitz",
    name: "Judgment Day Blitz",
    power: 3800000,
    rarity: "CUSTOM",
    color: "#ffcc66",
    description: "A custom account-only attack."
  },
  {
    id: "karma_reversal_slam",
    name: "Karma Reversal Slam",
    power: 1250000,
    rarity: "CUSTOM",
    color: "#b300b3",
    description: "A custom account-only attack."
  },
  {
    id: "lightning_rail_discharge",
    name: "Lightning Rail Discharge",
    power: 1050000,
    rarity: "CUSTOM",
    color: "#ffff00",
    description: "A custom account-only attack."
  },
  {
    id: "meteor_rain_ultimate",
    name: "Meteor Rain Ultimate",
    power: 2900000,
    rarity: "CUSTOM",
    color: "#ff471a",
    description: "A custom account-only attack."
  },
  {
    id: "nebula_vortex",
    name: "Nebula Vortex",
    power: 2150000,
    rarity: "CUSTOM",
    color: "#0066ff",
    description: "A custom account-only attack."
  },
  {
    id: "necrotic_pulse",
    name: "Necrotic Pulse",
    power: 950000,
    rarity: "CUSTOM",
    color: "#2e5c1e",
    description: "A custom account-only attack."
  },
  {
    id: "nether_rend",
    name: "Nether Rend",
    power: 1380000,
    rarity: "CUSTOM",
    color: "#400080",
    description: "A custom account-only attack."
  },
  {
    id: "nova_detonation",
    name: "Nova Detonation",
    power: 2450000,
    rarity: "CUSTOM",
    color: "#ff8000",
    description: "A custom account-only attack."
  },
  {
    id: "omega_beam",
    name: "Omega Beam",
    power: 3600000,
    rarity: "CUSTOM",
    color: "#ff0022",
    description: "A custom account-only attack."
  },
  {
    id: "phantom_flurry",
    name: "Phantom Flurry",
    power: 800000,
    rarity: "CUSTOM",
    color: "#cccccc",
    description: "A custom account-only attack."
  },
  {
    id: "plague_swarm_burst",
    name: "Plague Swarm Burst",
    power: 880000,
    rarity: "CUSTOM",
    color: "#6b8e23",
    description: "A custom account-only attack."
  },
  {
    id: "plasma_vaporizer",
    name: "Plasma Vaporizer",
    power: 1950000,
    rarity: "CUSTOM",
    color: "#00ff66",
    description: "A custom account-only attack."
  },
  {
    id: "quantum_disruption",
    name: "Quantum Disruption",
    power: 2250000,
    rarity: "CUSTOM",
    color: "#3399ff",
    description: "A custom account-only attack."
  },
  {
    id: "ragnarok_saber",
    name: "Ragnarok Saber",
    power: 3100000,
    rarity: "CUSTOM",
    color: "#e6005c",
    description: "A custom account-only attack."
  },
  {
    id: "reaper_scythe_slice",
    name: "Reaper Scythe Slice",
    power: 1750000,
    rarity: "CUSTOM",
    color: "#1f1f1f",
    description: "A custom account-only attack."
  }
    ],
    potions: {
      minor: 9999999999999999999999,
      greater: 999999999999999999999999,
    }
  }
];