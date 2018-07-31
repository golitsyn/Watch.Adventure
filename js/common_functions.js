var c_version = 2;
var EPS = 0.00000001; // 144-Number.EPSILON was 144 at the time :| [17/07/18]
var REPS = ((Number && Number.EPSILON) || EPS);
var CINF = 999999999999999;
var colors = {
  "range": "#93A6A2",
  "armor": "#5C5D5E",
  "resistance": "#6A5598",
  "attack": "#DB2900",
  "str": "#F07F2F",
  "int": "#3E6EED",
  "dex": "#44B75C",
  "speed": "#36B89E",
  "cash": "#5DAC40",
  "hp": "#FF2E46",
  //"mp":"#365DC5",
  "mp": "#3a62ce",
  "party_xp": "#AD73E0",
  "xp": "#CBFFFF",
  "gold": "gold",
  "male": "#43A1C6",
  "female": "#C06C9B",
  "server_success": "#85C76B",
  "server_failure": "#C7302C",
  "poison": "#41834A",
  "ability": "#ff9100",
  // nice-green #66ad0f - neon-orange #ff9100
  "xmas": "#C82F17",
  "xmasgreen": "#33BF6D",
  "codeblue": "#32A3B0",
  "codepink": "#E13758",
  "A": "#39BB54",
  "B": "#DB37A3",
  "npc_white": "#EBECEE",
  "white_positive": "#C3FFC0",
  "white_negative": "#FFDBDC",
  "serious_red": "#BC0004",
  "serious_green": "#428727",
  "heal": "#EE4D93",
}
var trade_slots = [],
  check_slots = ["elixir"];
for (var i = 1; i <= 16; i++) trade_slots.push("trade" + i), check_slots.push("trade" + i);
var character_slots = ["ring1", "ring2", "earring1", "earring2", "belt", "mainhand", "offhand", "helmet", "chest", "pants", "shoes", "gloves", "amulet", "orb", "elixir", "cape"];
var booster_items = ["xpbooster", "luckbooster", "goldbooster"];
var can_buy = {};

function process_game_data() {
  G.quests = {};
  for (var name in G.monsters) {
    if (G.monsters[name].charge) continue;
    if (G.monsters[name].speed >= 60) G.monsters[name].charge = round(G.monsters[name].speed * 1.20);
    else if (G.monsters[name].speed >= 50) G.monsters[name].charge = round(G.monsters[name].speed * 1.30);
    else if (G.monsters[name].speed >= 32) G.monsters[name].charge = round(G.monsters[name].speed * 1.4);
    else if (G.monsters[name].speed >= 20) G.monsters[name].charge = round(G.monsters[name].speed * 1.6);
    else if (G.monsters[name].speed >= 10) G.monsters[name].charge = round(G.monsters[name].speed * 1.7);
    else G.monsters[name].charge = round(G.monsters[name].speed * 2);
    G.monsters[name].max_hp = G.monsters[name].hp; // So default value adoption logic is easier [16/04/18]
  }
  for (var name in G.maps) {
    var map = G.maps[name];
    if (map.ignore) continue;
    // var M=map.data={x_lines:(G.geometry[name].x_lines||[]).slice(),y_lines:(G.geometry[name].y_lines||[]).slice()},LD=5;
    var M = map.data = G.geometry[name];
    // Instead of extending lines, applied the emulated move forward logic everywhere [18/07/18]
    // G.geometry[name].x_lines=[]; G.geometry[name].y_lines=[]; // New system [17/07/18]
    // map.data.x_lines.forEach(function(line){
    // 	G.geometry[name].x_lines.push([line[0]-LD,line[1]-LD,line[2]+LD]);
    // 	G.geometry[name].x_lines.push([line[0]+LD,line[1]-LD,line[2]+LD]);
    // });
    // G.geometry[name].x_lines.sort(function(a,b){return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);});
    // map.data.y_lines.forEach(function(line){
    // 	G.geometry[name].y_lines.push([line[0]-LD,line[1]-LD,line[2]+LD]);
    // 	G.geometry[name].y_lines.push([line[0]+LD,line[1]-LD,line[2]+LD]); // The extra 4px is roughly the size of character shoes
    // });
    // G.geometry[name].y_lines.sort(function(a,b){return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);});
    map.items = {};
    map.merchants = [];
    map.ref = map.ref || {};
    (map.npcs || []).forEach(function(npc) {
      if (!npc.position) return;
      var location = {
        map: name,
        "in": name,
        x: npc.position[0],
        y: npc.position[1],
        id: npc.id
      },
        data = G.npcs[npc.id];
      if (data.items) {
        map.merchants.push(location);
        data.items.forEach(function(name) {
          if (!name) return;
          if (G.items[name].cash) {
            G.items[name].buy_with_cash = true;
            return;
          }
          map.items[name] = map.items[name] || [];
          map.items[name].push(location);
          can_buy[name] = true;
          G.items[name].buy = true;
        });
      }
      map.ref[npc.id] = location;
      if (data.role == "newupgrade") map.upgrade = map.compound = location; // Refactored the NPC's, but decided to leave these [26/06/18]
      if (data.role == "exchange") map.exchange = location;
      if (data.quest) G.quests[data.quest] = location;

    });
  }
  for (var id in G.items)
  G.items[id].id = id;
  G.maps.desertland.transporter = {
    "in": "desertland",
    "map": "desertland",
    "id": "transporter",
    "x": 0,
    "y": 0
  };
}

function test_logic() {
  for (var id in G.items) {
    G.items[id].cash = 0;
    G.items[id].g = G.items[id].g || 1; // actual values now
  }
  for (var id in G.monsters) {
    G.monsters[id].xp = 0;
  }
}

function hardcore_logic() {
  for (var id in G.items) {
    // if(G.items[id].tier==2) G.items[id].a=0;
  }
  G.npcs.premium.items.forEach(function(item) {
    if (item) {
      G.items[item].cash = 0;
      G.items[item].g = parseInt(G.items[item].g * 2);
    }
  });
  G.items.offering.g = parseInt(G.items.offering.g / 2);
  G.items.xptome.g = 99999999;
  G.items.computer.g = 1;
  G.items.gemfragment.e = 10;
  G.items.leather.e = 5;
  G.maps.main.monsters.push({
    "type": "wabbit",
    "boundary": [-282, 702, 218, 872],
    "count": 1
  });
  G.npcs.scrolls.items[9] = "vitscroll";
  G.monsters.wabbit.evasion = 96.0;
  G.monsters.wabbit.reflection = 96.0;
  G.monsters.phoenix.respawn = 1;
  G.monsters.mvampire.respawn = 1;
  // G.items.gem0.a=0;
  // G.items.gem1.a=0;
  // G.items.armorbox.a=0;
  // G.items.weaponbox.a=0;
}

function object_sort(o, algorithm) {
  function lexi(a, b) {
    if (a[0] < b[0]) return -1;
    return 1;
  }
  var a = [];
  for (var id in o) a.push([id, o[id]]);
  if (!algorithm) a.sort(lexi);
  return a;
}

function within_xy_range(observer, entity) {
  if (observer['in'] != entity['in']) return false
  if (!observer.vision) return false;
  var x = get_x(entity),
    y = get_y(entity),
    o_x = get_x(observer),
    o_y = get_y(observer);
  if (o_x - observer.vision[0] < x && x < o_x + observer.vision[0] && o_y - observer.vision[1] < y && y < o_y + observer.vision[1]) return true;
  return false;
}

function distance(a, b, in_check) {
  if (in_check && a. in != b. in ) return 99999999;
  if ("width" in a && "width" in b) {
    var min_d = 99999999,
      a_w = a.width,
      a_h = a.height,
      b_w = b.width,
      b_h = b.height,
      dist;
    if ("awidth" in a) a_w = a.awidth, a_h = a.aheight;
    if ("awidth" in b) b_w = b.awidth, b_h = b.aheight;
    // a_h*=0.75; b_h*=0.75; // This seems better, thanks to draw_circle REVISIT!!
    var a_x = get_x(a),
      a_y = get_y(a),
      b_x = get_x(b),
      b_y = get_y(b);
    // [{x:a_x-a_w/2,y:a_y},{x:a_x+a_w/2,y:a_y},{x:a_x+a_w/2,y:a_y-a_h},{x:a_x-a_w/2,y:a_y-a_h}].forEach(function(p1){
    // 	[{x:b_x-b_w/2,y:b_y},{x:b_x+b_w/2,y:b_y},{x:b_x+b_w/2,y:b_y-b_h},{x:b_x-b_w/2,y:b_y-b_h}].forEach(function(p2){
    // 		dist=simple_distance(p1,p2);
    // 		if(dist<min_d) min_d=dist;
    // 	})
    // });
    [{
      x: a_x - a_w / 2,
      y: a_y - a_h / 2
    }, {
      x: a_x + a_w / 2,
      y: a_y - a_h / 2
    }, {
      x: a_x,
      y: a_y
    }, {
      x: a_x,
      y: a_y - a_h
    }].forEach(function(p1) {[{
        x: b_x - b_w / 2,
        y: b_y - b_h / 2
      }, {
        x: b_x + b_w / 2,
        y: b_y - b_h / 2
      }, {
        x: b_x,
        y: b_y
      }, {
        x: b_x,
        y: b_y - b_h
      }].forEach(function(p2) {
        dist = simple_distance(p1, p2);
        if (dist < min_d) min_d = dist;
      })
    });
    // console.log(min_d);
    return min_d;
  }
  return simple_distance(a, b);
}

function can_transport(entity) {
  return can_walk(entity);
}

function can_walk(entity) {
  if (is_game && entity.me && transporting && ssince(transporting) < 8 && !entity.c.town) return false;
  if (is_code && entity.me && parent.transporting && ssince(parent.transporting) < 8 && !entity.c.town) return false;
  return !is_disabled(entity);
}

function is_disabled(entity) {
  if (!entity || entity.rip || (entity.s && entity.s.stunned)) return true;
}

function calculate_item_grade(def, item) {
  if (!(def.upgrade || def.compound)) return 0;
  if ((item && item.level || 0) >= (def.grades || [11, 12])[1]) return 2;
  if ((item && item.level || 0) >= (def.grades || [11, 12])[0]) return 1;
  return 0;
}

function calculate_item_value(item) {
  if (!item) return 0;
  if (item.gift) return 1;
  var def = G.items[item.name],
    value = def.cash && def.g || def.g * 0.6,
    divide = 1; // previously 0.8
  if (def.compound && item.level) {
    var grade = 0,
      grades = def.grades || [11, 12],
      s_value = 0;
    for (var i = 1; i <= item.level; i++) {
      if (i > grades[1]) grade = 2;
      else if (i > grades[0]) grade = 1;
      if (def.cash) value *= 1.5;
      else value *= 3.2;
      value += G.items["cscroll" + grade].g / 2.4;
    }
  }
  if (def.upgrade && item.level) {
    var grade = 0,
      grades = def.grades || [11, 12],
      s_value = 0;
    for (var i = 1; i <= item.level; i++) {
      if (i > grades[1]) grade = 2;
      else if (i > grades[0]) grade = 1;
      s_value += G.items["scroll" + grade].g / 2;
      if (i >= 7) value *= 3, s_value *= 1.32;
      else if (i == 6) value *= 2.4;
      else if (i >= 4) value *= 2;
      if (i == 9) value *= 2.64, value += 400000;
      if (i == 10) value *= 5;
      if (i == 11) value *= 2;
      if (i == 12) value *= 1.8;
    }
    value += s_value;
  }
  if (item.expires) divide = 8;
  return round(value / divide) || 0;
}

var prop_cache = {}; // reset at reload_server

function damage_multiplier(defense) // [10/12/17]
{
  return min(1.32, max(0.05, 1 - (max(0, min(100, defense)) * 0.00100 + max(0, min(100, defense - 100)) * 0.00100 + max(0, min(100, defense - 200)) * 0.00095 + max(0, min(100, defense - 300)) * 0.00090 + max(0, min(100, defense - 400)) * 0.00082 + max(0, min(100, defense - 500)) * 0.00070 + max(0, min(100, defense - 600)) * 0.00060 + max(0, min(100, defense - 700)) * 0.00050 + max(0, defense - 800) * 0.00040) + max(0, min(50, 0 - defense)) * 0.00100 + // Negative's / Armor Piercing
  max(0, min(50, -50 - defense)) * 0.00075 + max(0, min(50, -100 - defense)) * 0.00050 + max(0, -150 - defense) * 0.00025));
}

function calculate_item_properties(def, item) {
  var prop_key = def.name + (def.card || "") + "|" + item.level + "|" + item.stat_type + "|" + item.p;
  if (prop_cache[prop_key]) return prop_cache[prop_key];
  //#NEWIDEA: An item cache here [15/11/16]
  var prop = {
    "gold": 0,
    "luck": 0,
    "xp": 0,
    "int": 0,
    "str": 0,
    "dex": 0,
    "charisma": 0,
    "cuteness": 0,
    "awesomeness": 0,
    "bling": 0,
    "vit": 0,
    "hp": 0,
    "mp": 0,
    "attack": 0,
    "range": 0,
    "armor": 0,
    "resistance": 0,
    "stat": 0,
    "speed": 0,
    "level": 0,
    "evasion": 0,
    "miss": 0,
    "reflection": 0,
    "lifesteal": 0,
    "attr0": 0,
    "attr1": 0,
    "rpiercing": 0,
    "apiercing": 0,
    "crit": 0,
    "dreturn": 0,
    "frequency": 0,
    "mp_cost": 0,
    "output": 0,
  }
  if (def.upgrade || def.compound) {
    var u_def = def.upgrade || def.compound;
    level = item.level || 0;
    prop.level = level;
    for (var i = 1; i <= level; i++) {
      var multiplier = 1;
      if (def.upgrade) {
        if (i == 7) multiplier = 1.25;
        if (i == 8) multiplier = 1.5;
        if (i == 9) multiplier = 2;
        if (i == 10) multiplier = 3;
        if (i == 11) multiplier = 1.25;
        if (i == 12) multiplier = 1.5;
      } else if (def.compound) {
        if (i == 5) multiplier = 1.25;
        if (i == 6) multiplier = 1.5;
        if (i == 7) multiplier = 2;
        if (i >= 8) multiplier = 3;
      }
      for (p in u_def) {
        if (p == "stat") prop[p] += round(u_def[p] * multiplier);
        else prop[p] += u_def[p] * multiplier; // for weapons with float improvements [04/08/16]
        if (p == "stat" && i >= 7) prop.stat++;
      }
    }

  }
  for (p in def)
  if (prop[p] != undefined) prop[p] += def[p];
  for (p in prop)
  if (!in_arr(p, ["evasion", "reflection", "lifesteal", "attr0", "attr1", "crit"])) prop[p] = round(prop[p]);
  if (def.stat && item.stat_type) {
    prop[item.stat_type] += prop.stat * {
      "str": 1,
      "vit": 1,
      "dex": 1,
      "int": 1,
      "evasion": 0.125,
      "reflection": 0.875,
      "rpiercing": 1.25,
      "apiercing": 1.25
    }[item.stat_type];
    prop.stat = 0;
  }
  // for(p in prop) prop[p]=floor(prop[p]); - round probably came after this one, commenting out [13/09/16]
  if (item.p == "shiny") {
    if (prop.attack) {
      prop.attack += 5;
    } else if (prop.stat) {
      prop.stat += 2;
    } else if (prop.armor) {
      prop.armor += 15;
      prop.resistance = (prop.resistance || 0) + 10;
    }
  }
  prop_cache[prop_key] = prop;
  return prop;
}

function random_one(arr) {
  return arr[parseInt(arr.length * Math.random())];
}

function to_pretty_num(num) {
  if (!num) return "0";
  num = round(num);
  var pretty = "";
  while (num) {
    var current = num % 1000;
    if (!current) current = "000";
    else if (current < 10 && current != num) current = "00" + current;
    else if (current < 100 && current != num) current = "0" + current;
    if (!pretty) pretty = current;
    else pretty = current + "," + pretty;
    num = (num - num % 1000) / 1000;
  }
  return "" + pretty;
}

function e_array(num) {
  var array = [];
  for (var i = 0; i < num; i++) array.push(null);
  return array;
}

function set_xy(entity, x, y) {
  if ("real_x" in entity) entity.real_x = x, entity.real_y = y;
  else entity.x = x, entity.y = y;
}

function get_xy(e) {
  return [get_x(e), get_y(e)];
}

function get_x(e) {
  if ("real_x" in e) return e.real_x;
  return e.x;
}

function get_y(e) {
  if ("real_y" in e) return e.real_y;
  return e.y;
}

function simple_distance(a, b) {
  var a_x = get_x(a),
    a_y = get_y(a),
    b_x = get_x(b),
    b_y = get_y(b);
  if (a.map && b.map && a.map != b.map) return 9999999;
  return Math.sqrt((a_x - b_x) * (a_x - b_x) + (a_y - b_y) * (a_y - b_y))
}

function calculate_vxy(monster, speed_mult) {
  if (!speed_mult) speed_mult = 1;
  monster.ref_speed = monster.speed;
  var total = 0.0001 + sq(monster.going_x - monster.from_x) + sq(monster.going_y - monster.from_y);
  total = sqrt(total);
  monster.vx = monster.speed * speed_mult * (monster.going_x - monster.from_x) / total;
  monster.vy = monster.speed * speed_mult * (monster.going_y - monster.from_y) / total;
  if (1 || is_game) monster.angle = Math.atan2(monster.going_y - monster.from_y, monster.going_x - monster.from_x) * 180 / Math.PI; // now the .angle is used on .resync [03/08/16]
  // -90 top | 0 right | 180/-180 left | 90 bottom
  // if(monster==character) console.log(monster.angle);
}

function recalculate_vxy(monster) {
  if (monster.moving && monster.ref_speed != monster.speed) {
    if (is_server) monster.move_num++;
    calculate_vxy(monster);
  }
}

function is_in_front(observer, entity) {
  var angle = Math.atan2(get_y(entity) - get_y(observer), get_x(entity) - get_x(observer)) * 180 / Math.PI;
  // console.log(angle+" vs existing "+observer.angle);
  if (observer.angle !== undefined && Math.abs(observer.angle - angle) <= 45) return true; // drawn at notebook 2, based on those drawings [11/09/16]
  return false;
}

function calculate_movex(map, cur_x, cur_y, target_x, target_y) {
  if (target_x == Infinity) target_x = CINF;
  if (target_y == Infinity) target_y = CINF;
  //console.log(cur_x+" "+cur_y+" "+target_x+" "+target_y);
  var going_down = cur_y < target_y;
  var going_right = cur_x < target_x;

  var x_lines = map.x_lines || [];
  var y_lines = map.y_lines || [];

  var min_x = min(cur_x, target_x);
  var max_x = max(cur_x, target_x);
  var min_y = min(cur_y, target_y);
  var max_y = max(cur_y, target_y);

  var dx = target_x - cur_x;
  var dy = target_y - cur_y;

  var dydx = dy / (dx + REPS);
  //console.log(dydx);
  var dxdy = 1 / dydx;

  var XEPS = 10 * EPS; // 1 EPS isn't enough, can's move along line[0]+EPS with can_move

  for (var i = bsearch_start(x_lines, min_x); i < x_lines.length; i++) {
    var line = x_lines[i];
    var line_x = line[0],
      line_xE = line_x + XEPS;
    if (going_right) line_xE = line_x - XEPS;

    if (max_x < line_x) break;
    if (max_x < line_x || min_x > line_x || max_y < line[1] || min_y > line[2]) {
      continue;
    }

    var y_intersect = cur_y + (line_x - cur_x) * dydx;

    if (eps_equal(cur_x, target_x) && eps_equal(cur_x, line_x)) // allows you to move parallelly right into the lines
    {
      line_xE = line_x;
      if (going_down) y_intersect = min(line[1], line[2]) - XEPS, target_y = min(target_y, y_intersect), max_y = target_y;
      else min_y = y_intersect = max(line[1], line[2]) + XEPS, target_y = min(target_y, y_intersect), min_y = target_y;
      continue;
    }


    if (y_intersect < line[1] || y_intersect > line[2]) {
      continue;
    }


    if (going_down) {
      target_y = min(target_y, y_intersect);
      max_y = target_y;
    } else {
      target_y = max(target_y, y_intersect);
      min_y = target_y;
    }

    if (going_right) {
      target_x = min(target_x, line_xE); // Can never be directly on the lines themselves
      max_x = target_x;
    } else {
      target_x = max(target_x, line_xE);
      min_x = target_x;
    }
  }

  for (var i = bsearch_start(y_lines, min_y); i < y_lines.length; i++) {
    var line = y_lines[i];
    var line_y = line[0],
      line_yE = line_y + XEPS;
    if (going_down) line_yE = line_y - XEPS;

    if (max_y < line_y) break;
    if (max_y < line_y || min_y > line_y || max_x < line[1] || min_x > line[2]) {
      continue;
    }

    var x_intersect = cur_x + (line_y - cur_y) * dxdy;

    if (eps_equal(cur_y, target_y) && eps_equal(cur_y, line_y)) {
      line_yE = line_y;
      if (going_right) x_intersect = min(line[1], line[2]) - XEPS, target_x = min(target_x, x_intersect), max_x = target_x;
      else min_x = x_intersect = max(line[1], line[2]) + XEPS, target_x = min(target_x, x_intersect), min_x = target_x;
      continue;
    }

    if (x_intersect < line[1] || x_intersect > line[2]) {
      continue;
    }


    if (going_right) {
      target_x = min(target_x, x_intersect);
      max_x = target_x;
    } else {
      target_x = max(target_x, x_intersect);
      min_x = target_x;
    }

    if (going_down) {
      target_y = min(target_y, line_yE);
      max_y = target_y;
    } else {
      target_y = max(target_y, line_yE);
      min_y = target_y;
    }
  }

  // console.log(target_x+" "+target_y);
  return {
    x: target_x,
    y: target_y
  };
}

function get_height(entity) // visual height
{
  if (entity.me) return entity.aheight;
  else if (entity.mscale) return entity.height / entity.mscale;
  else return entity.height;
}

function get_width(entity) // visual width
{
  if (entity.me) return entity.awidth;
  else if (entity.mscale) return entity.width / entity.mscale;
  else return entity.width;
}


function set_base(entity) {
  var type = entity.mtype || entity.type;
  entity.base = {
    h: 8,
    v: 7,
    vn: 2
  };
  if (G.dimensions[type] && G.dimensions[type][3]) {
    entity.base.h = G.dimensions[type][3];
    entity.base.v = min(9.9, G.dimensions[type][4]); // v+vn has to be <12
  } else {
    entity.base.h = min(12, get_width(entity) * 0.80);
    entity.base.v = min(9.9, get_height(entity) / 4.0);
  }
}

function calculate_move_v2(map, cur_x, cur_y, target_x, target_y) // improved, v2 - all movements should originate from cur_x and cur_y
{
  if (target_x == Infinity) target_x = CINF;
  if (target_y == Infinity) target_y = CINF;
  var move = calculate_movex(map, cur_x, cur_y, target_x, target_y);
  if (move.x != target_x && move.y != target_y) // this is a smooth move logic - if a line hit occurs, keeps moving in the movable direction
  {
    var move2 = calculate_movex(map, cur_x, cur_y, target_x, move.y);
    if (move2.x == move.x) {
      var move2 = calculate_movex(map, cur_x, cur_y, move2.x, target_y);
    }
    return move2;
  }
  // return move_further(cur_x,cur_y,move.x,move.y,100);
  return move;
}

var m_calculate = false,
  m_line_x = false,
  m_line_y = false,
  line_hit_x = null,
  line_hit_y = null,
  m_dx, m_dy; // flags so can_calculate and can_move work in synergy

function calculate_move(entity, target_x, target_y) // v5, calculate 4 edges, choose the minimal move [18/07/18]
{
  // -8,+8 left/right 0,-7 down/up
  m_calculate = true;
  var map = entity.map,
    cur_x = get_x(entity),
    cur_y = get_y(entity);
  var corners = [[0, 0]];
  var moves = [[target_x, target_y]],
    x_moves = [];
  if (entity.base) corners = [[-entity.base.h, entity.base.vn], [entity.base.h, entity.base.vn], [-entity.base.h, -entity.base.v], [entity.base.h, -entity.base.v]];
  // Test the movement limits of all 4 corners of an entity, and record the [mmx,mmy] at the limit
  corners.forEach(function(mxy) {
    for (var i = 0; i < 3; i++) {
      var mx = mxy[0],
        my = mxy[1];
      var dx = target_x + mx,
        dy = target_y + my;
      if (i == 1) dx = cur_x + mx;
      if (i == 2) dy = cur_y + my;
      var cmove = calculate_movex(G.geometry[map] || {}, cur_x + mx, cur_y + my, dx, dy);
      var cdist = point_distance(cur_x + mx, cur_y + my, cmove.x, cmove.y);
      // add_log(cdist,"orange");
      mx = cmove.x - mx;
      my = cmove.y - my;
      // add_log("mx/y: "+mx+","+my);
      if (!in_arrD2([mx, my], moves)) moves.push([mx, my]);
      // New logic, just check all possibilities, original logic just checked the min cdist
      // Sometimes the minimum move is just a stuck corner in another move angle, so all possibilities need to be checked
      // if(Math.abs(mx-round(mx))<40*EPS && !in_arrD2([mx,cur_y],moves)) moves.push([mx,cur_y]);
      // x- if(Math.abs(mx-round(mx))<40*EPS && !in_arrD2([mx,target_y],moves) || 1) moves.push([mx,target_y]);
      // if(Math.abs(my-round(my))<40*EPS && !in_arrD2([cur_x,my],moves)) moves.push([cur_x,my]);
      // x- if(Math.abs(my-round(my))<40*EPS && !in_arrD2([target_x,my],moves) || 1) moves.push([target_x,my]);
    }
  });
  // console.log(moves);
  var max = -1,
    move = {
      x: cur_x,
      y: cur_y
    },
    min = CINF;
  // Test all boundary coordinates, if none of them work, don't move


  function check_move(xy) { // This is the smooth move logic, even if you hit a line, you might still move along that line
    var x = xy[0],
      y = xy[1];
    if (can_move({
      map: map,
      x: cur_x,
      y: cur_y,
      going_x: x,
      going_y: y,
      base: entity.base
    })) {
      // var cdist=point_distance(cur_x,cur_y,x,y);
      // if(cdist>max)
      // {
      // 	max=cdist;
      // 	move={x:x,y:y};
      // }
      var cdist = point_distance(target_x, target_y, x, y);
      // #IDEA: If the angle difference between intended angle, and move angle is factored in too, the selected movement could be the most natural one [20/07/18] 
      if (cdist < min) {
        min = cdist;
        move = {
          x: x,
          y: y
        };
      }
    }
    if (line_hit_x !== null) x_moves.push([line_hit_x, line_hit_y]), line_hit_x = null, line_hit_y = null;
  }
  moves.forEach(check_move);
  // console.log(x_moves);
  x_moves.forEach(check_move);
  //add_log("Intention: "+target_x+","+target_y);
  //add_log("Calculation: "+move.x+","+move.y+" ["+max+"]");
  //add_log(point_distance(cur_x,cur_y,move.x,move.y),"#FC5066");
  if (point_distance(cur_x, cur_y, move.x, move.y) < 10 * EPS) move = {
    x: cur_x,
    y: cur_y
  }; // The new movement has a bouncing effect, so for small moves, just don't move
  m_calculate = false;
  return move;
}

// Why are there so many imperfect, mashed up movement routines? [17/07/18]
// First of all there is no order to lines, the map maker inserts lines randomly, so they are not polygons etc.
// Even if they were polygons, there are non-movable regions inside movable regions
// So all in all, the game evolved into a placeholder, non-perfect, not well-thought line system, that became permanent
// One other challenge is visuals, the x,y of entities are their bottom points, so if they move too close to the lines, the game doesn't look appealing
// Anyway, that's pretty much what's going on here, the latest iterations are pretty complex in a bad way, but they account for all the issues and challenges, include improvements
// If there's even a slightest mismatch, any edge case not handled, it will cause a player or monster to walk out the lines, be jailed, and mess up the game
// [19/07/18] - Finally solved all the challenges, by considering entities as 4 cornered rectangles, and making sure all 4 corners can move
// Caveats of the 4-corner - if there's a single line, for example a fence line, the player rectangle can be penetrated

function point_distance(x0, y0, x1, y1) {
  return Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0))
}

function recalculate_move(entity) {
  move = calculate_move(entity, entity.going_x, entity.going_y);
  entity.going_x = move.x;
  entity.going_y = move.y;
}

function bsearch_start(arr, value) {
  var start = 0,
    end = arr.length - 1,
    current;
  while (start < end - 1) {
    current = parseInt((start + end) / 2);
    if (arr[current][0] < value) start = current;
    else end = current - 1;
  }
  // while(start<arr.length && arr[start][0]<value) start++;
  // If this line is added, some of the can_move + calculate_movex conditions can be removed [19/07/18]
  return start;
}

function can_move(monster, based) {
  // An XY-tree would be ideal, but the current improvements should be enough [16/07/18]
  var GEO = G.geometry[monster.map] || {},
    c = 0;
  var x0 = monster.x,
    y0 = monster.y,
    x1 = monster.going_x,
    y1 = monster.going_y,
    next, minx = min(x0, x1),
    miny = min(y0, y1),
    maxx = max(x0, x1),
    maxy = max(y0, y1);
  if (!based && monster.base) // If entity is a rectangle, check all 4 corner movements
  {
    var can = true;[[-monster.base.h, monster.base.vn], [monster.base.h, monster.base.vn], [-monster.base.h, -monster.base.v], [monster.base.h, -monster.base.v]].forEach(function(mxy) {
      var mx = mxy[0],
        my = mxy[1];
      if (!can || !can_move({
        map: monster.map,
        x: x0 + mx,
        y: y0 + my,
        going_x: x1 + mx,
        going_y: y1 + my
      }, 1)) can = false;
    });
    if (1) // fence logic, orphan lines - at the destination, checks whether we can move from one rectangle point to the other, if we can't move, it means a line penetrated the rectangle
    { // [20/07/18]
      var px0 = monster.base.h,
        px1 = -monster.base.h;
      m_line_x = max; // going left
      if (x1 > x0) px0 = -monster.base.h, px1 = monster.base.h, mcy = m_line_x = min; // going right
      var py0 = monster.base.vn,
        py1 = -monster.base.v;
      m_line_y = max; // going up
      if (y1 > y0) py0 = -monster.base.v, py1 = monster.base.vn, m_line_y = min; // going down
      m_dx = -px1;
      m_dy = -py1; // Find the line hit, then convert to actual coordinates
      if (!can || !can_move({
        map: monster.map,
        x: x1 + px1,
        y: y1 + py0,
        going_x: x1 + px1,
        going_y: y1 + py1
      }, 1)) can = false;
      if (!can || !can_move({
        map: monster.map,
        x: x1 + px0,
        y: y1 + py1,
        going_x: x1 + px1,
        going_y: y1 + py1
      }, 1)) can = false;
      m_line_x = m_line_y = false;

    }
    return can;
  }

  function line_hit_logic(ax, ay, bx, by) {
    line_hit_x = m_line_x(ax, bx), line_hit_x = m_line_x(line_hit_x + 6 * EPS, line_hit_x - 6 * EPS) + m_dx;
    line_hit_y = m_line_y(ay, by), line_hit_y = m_line_y(line_hit_y + 6 * EPS, line_hit_y - 6 * EPS) + m_dy;
  }
  for (var i = bsearch_start(GEO.x_lines || [], minx); i < (GEO.x_lines || []).length; i++) {
    var line = GEO.x_lines[i]; // c++;
    if (line[0] == x1 && (line[1] <= y1 && line[2] >= y1 || line[0] == x0 && y0 <= line[1] && y1 > line[1])) // can't move directly onto lines - or move over lines, parallel to them
    {
      if (m_line_y) line_hit_logic(line[0], line[1], line[0], line[2]);
      return false;
    }
    if (minx > line[0]) continue; // can be commented out with: while(start<arr.length && arr[start][0]<value) start++;
    if (maxx < line[0]) break; // performance improvement, we moved past our range [16/07/18]
    next = y0 + (y1 - y0) * (line[0] - x0) / (x1 - x0 + REPS);
    if (!(line[1] - EPS <= next && next <= line[2] + EPS)) continue; // Fixed EPS [16/07/18]
    //add_log("line clash")
    if (m_line_y) line_hit_logic(line[0], line[1], line[0], line[2]);
    return false;
  }
  for (var i = bsearch_start(GEO.y_lines || [], miny); i < (GEO.y_lines || []).length; i++) {
    var line = GEO.y_lines[i]; // c++;
    if (line[0] == y1 && (line[1] <= x1 && line[2] >= x1 || line[0] == y0 && x0 <= line[1] && x1 > line[1])) {
      if (m_line_x) line_hit_logic(line[1], line[0], line[2], line[0]);
      return false;
    }
    if (miny > line[0]) continue;
    if (maxy < line[0]) break;
    next = x0 + (x1 - x0) * (line[0] - y0) / (y1 - y0 + REPS);
    if (!(line[1] - EPS <= next && next <= line[2] + EPS)) continue;
    if (m_line_x) line_hit_logic(line[1], line[0], line[2], line[0]);
    return false;
  }
  // console.log(c);
  return true;
}

function closest_line(map, x, y) {
  var min = 16000;[[0, 16000], [0, -16000], [16000, 0], [-16000, 0]].forEach(function(mxy) {
    var mx = mxy[0],
      my = mxy[1];
    var move = calculate_move({
      map: map,
      x: x,
      y: y
    }, x + mx, y + my);
    // console.log(move);
    var cdist = point_distance(x, y, move.x, move.y);
    if (cdist < min) min = cdist;
  });
  return min;
}

function stop_logic(monster) {
  if (!monster.moving) return;
  var x = get_x(monster),
    y = get_y(monster);
  // old: if((monster.from_x<=monster.going_x && x>=monster.going_x) || (monster.from_x>=monster.going_x && x<=monster.going_x) || abs(x-monster.going_x)<0.3 || abs(y-monster.going_y)<0.3)
  if (((monster.from_x <= monster.going_x && x >= monster.going_x - 0.1) || (monster.from_x >= monster.going_x && x <= monster.going_x + 0.1)) && ((monster.from_y <= monster.going_y && y >= monster.going_y - 0.1) || (monster.from_y >= monster.going_y && y <= monster.going_y + 0.1))) {
    set_xy(monster, monster.going_x, monster.going_y);

    //monster.going_x=undefined; - setting these to undefined had bad side effects, where a character moves in the client side, stops in server, and going_x becoming undefined mid transit client side [18/06/18]
    //monster.going_y=undefined;
    if (monster.loop) {
      monster.going_x = monster.positions[(monster.last + 1) % monster.positions.length][0];
      monster.going_y = monster.positions[(++monster.last) % monster.positions.length][1];
      monster.u = true;
      start_moving_element(monster);
      return;
    }

    monster.moving = false;
    monster.vx = monster.vy = 0; // added these 2 lines, as the character can walk outside when setTimeout ticks at 1000ms's [26/07/16]
    // if(monster.me) console.log(monster.real_x+","+monster.real_y);
  }
}

function trigger(f) {
  setTimeout(f, 0);
}

function to_number(num) {
  try {
    num = round(parseInt(num));
    if (num < 0) return 0;
    if (!num) num = 0;
  } catch (e) {
    num = 0
  };
  return num;
}

function is_number(obj) {
  try {
    if (!isNaN(obj) && 0 + obj === obj) return true;
  } catch (e) {}
  return false;
}

function is_string(obj) {
  try {
    return Object.prototype.toString.call(obj) == '[object String]';
  } catch (e) {}
  return false;
}

function is_array(a) {
  try {
    if (Array.isArray(a)) return true;
  } catch (e) {}
  return false;
}

function is_function(f) {
  try {
    var g = {};
    return f && g.toString.call(f) === '[object Function]';
  } catch (e) {}
  return false;
}

function is_object(o) {
  try {
    return o !== null && typeof o === 'object';
  } catch (e) {}
  return false;
}

function clone(obj, args) {
  // http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
  if (!args) args = {};
  if (!args.seen && args.seen !== []) args.seen = []; // seen modification - manual [24/12/14]
  if (null == obj) return obj;
  if (args.simple_functions && is_function(obj)) return "[clone]:" + obj.toString().substring(0, 40);
  if ("object" != typeof obj) return obj;
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  if (obj instanceof Array) {
    args.seen.push(obj);
    var copy = [];
    for (var i = 0; i < obj.length; i++) {
      copy[i] = clone(obj[i], args);
    }
    return copy;
  }
  if (obj instanceof Object) {
    args.seen.push(obj);
    var copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        if (args.seen.indexOf(obj[attr]) !== -1) {
          copy[attr] = "circular_attribute[clone]";
          continue;
        }
        copy[attr] = clone(obj[attr], args);
      }
    }
    return copy;
  }
  throw "type not supported";
}

function safe_stringify(obj, third) // doesn't work for Event's - clone also doesn't work [31/08/15]
{
  var seen = [];
  try {
    return JSON.stringify(obj, function(key, val) {
      if (val != null && typeof val == "object") {
        if (seen.indexOf(val) >= 0) {
          return;
        }
        seen.push(val);
      }
      return val;
    }, third);
  } catch (e) {
    return "safe_stringify_exception";
  }
}

function smart_eval(code, args) {
  // window[cur.func] usages might execute the corresponding string and cause an exception - highly unlikely [22:32]
  if (!code) return;
  if (args && !is_array(args)) args = [args];
  if (is_function(code)) {
    if (args) code.apply(this, clone(args)); // if args are not cloned they persist and cause irregularities like mid persistence [02/08/14]
    else code();
  } else if (is_string(code)) eval(code);
}

function is_substr(a, b) {
  if (is_array(b)) {
    for (var i = 0; i < b.length; i++) {
      try {
        if (a && a.toLowerCase().indexOf(b[i].toLowerCase()) != -1) return true;
      } catch (e) {}
    }
  } else {
    try {
      if (a && a.toLowerCase().indexOf(b.toLowerCase()) != -1) return true;
    } catch (e) {}
  }
  return false;
}

function seed0() // as a semi-persistent seed
{
  return parseInt((new Date()).getMinutes() / 10.0)
}

function seed1() // as a semi-persistent seed
{
  return parseInt((new Date()).getSeconds() / 10.0)
}

function to_title(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function ascending_comp(a, b) {
  return a - b;
}

function delete_indices(array, to_delete) {
  to_delete.sort(ascending_comp);
  for (var i = to_delete.length - 1; i >= 0; i--)
  array.splice(to_delete[i], 1);
}

function array_delete(array, entity) {
  var index = array.indexOf(entity);
  if (index > -1) {
    array.splice(index, 1);
  }
}

function in_arr(i, kal) {
  if (is_array(i)) {
    for (var j = 0; j < i.length; j++)
    for (var el in kal) if (i[j] === kal[el]) return true;
  }
  for (var el in kal) if (i === kal[el]) return true;
  return false;
}

function in_arrD2(el, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (el[0] == arr[i][0] && el[1] == arr[i][1]) return true;
  }
  return false;
}


function c_round(n) {
  if (window.floor_xy) return Math.floor(n);
  if (!window.round_xy) return n;
  return Math.round(n);
}

function round(n) {
  return Math.round(n);
}

function sq(n) {
  return n * n;
}

function sqrt(n) {
  return Math.sqrt(n);
}

function floor(n) {
  return Math.floor(n);
}

function ceil(n) {
  return Math.ceil(n);
}

function eps_equal(a, b) {
  return Math.abs(a - b) < 5 * EPS;
}

function abs(n) {
  return Math.abs(n);
}

function min(a, b) {
  return Math.min(a, b);
}

function max(a, b) {
  return Math.max(a, b);
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
  return a;
}

function randomStr(len) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",
    schars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var str = '';
  for (var i = 0; i < len; i++) {
    if (i == 0) {
      var rnum = Math.floor(Math.random() * schars.length);
      str += schars.substring(rnum, rnum + 1);
    } else {
      var rnum = Math.floor(Math.random() * chars.length);
      str += chars.substring(rnum, rnum + 1);
    }
  }
  return str;
}

String.prototype.replace_all = function(find, replace) {
  var str = this;
  return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

function html_escape(html) {
  var escaped = html;
  var findReplace = [[/&/g, "&amp;"], [/</g, "&lt;"], [/>/g, "&gt;"], [/"/g, "&quot;"]];
  for (var item in findReplace)
  escaped = escaped.replace(findReplace[item][0], findReplace[item][1]);
  return escaped;
} /*"*/

function he(html) {
  return html_escape(html);
}

function future_ms(ms) {
  var c = new Date();
  c.setMilliseconds(c.getMilliseconds() + ms);
  return c;
}

function future_s(ms) {
  var c = new Date();
  c.setSeconds(c.getSeconds() + ms);
  return c;
}

function mssince(t, ref) {
  if (!ref) ref = new Date();
  return ref.getTime() - t.getTime();
}

function ssince(t, ref) {
  return mssince(t, ref) / 1000.0;
}

function msince(t, ref) {
  return mssince(t, ref) / 60000.0;
}

function hsince(t, ref) {
  return mssince(t, ref) / 3600000.0;
}

function randomStr(len) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",
    schars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var str = '';
  for (var i = 0; i < len; i++) {
    if (i == 0) {
      var rnum = Math.floor(Math.random() * schars.length);
      str += schars.substring(rnum, rnum + 1);
    } else {
      var rnum = Math.floor(Math.random() * chars.length);
      str += chars.substring(rnum, rnum + 1);
    }
  }
  return str;
}

function rough_size(object) {
  //reference: http://stackoverflow.com/a/11900218/914546
  var objectList = [];
  var stack = [object];
  var bytes = 0;

  while (stack.length) {
    var value = stack.pop();

    if (typeof value === 'boolean') {
      bytes += 4;
    } else if (typeof value === 'string') {
      bytes += value.length * 2;
    } else if (typeof value === 'number') {
      bytes += 8;
    } else if (
    typeof value === 'object' && objectList.indexOf(value) === -1) {
      objectList.push(value);

      for (var i in value) {
        stack.push(value[i]);
      }
    }
  }
  return bytes;
}