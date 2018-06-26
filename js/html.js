var u_item = null,
  u_scroll = null,
  u_offering = null,
  c_items = e_array(3),
  c_scroll = null,
  c_offering = null,
  c_last = 0,
  e_item = null,
  cr_items = e_array(9),
  cr_last = 0,
  ds_item = null;
var skillmap = {
  "1": {
    name: "use_hp"
  },
  "2": {
    name: "use_mp"
  },
  R: {
    name: "burst"
  }
},
  skillbar = [];
var settings_shown = 0;

function show_settings() {
  var a = "<div id='pagewrapper' style='z-index:9999; background: rgba(0,0,0,0.6)' onclick='hide_settings()'>";
  a += "<div id='pagewrapped'>";
  a += $("#settingshtml").html();
  a += "</div>";
  a += "</div>";
  $("#content").html(a);
  $("#pagewrapped").css("margin-top", Math.floor(($(window).height() - $("#pagewrapped").height()) / 2) + "px");
  resize()
}
var docked = [],
  cwindows = [];

function close_chat_window(a, c) {
  var b = a + (c || "");
  $("#chatw" + b).remove();
  array_delete(docked, b);
  array_delete(cwindows, b);
  redock()
}
function toggle_chat_window(a, c) {
  var b = a + (c || "");
  if (in_arr(b, docked)) {
    array_delete(docked, b);
    $(".chatb" + b).html("#");
    $("#chatw" + b).css("bottom", "auto");
    $("#chatw" + b).css("top", 400);
    $("#chatw" + b).css("left", 400);
    $("#chatw" + b).css("z-index", 70 + cwindows.length - docked.length);
    $("#chatw" + b).draggable();
    $("#chatt" + b).removeClass("newmessage")
  } else {
    $(".chatb" + b).html("+");
    $("#chatw" + b).draggable("destroy");
    $("#chatw" + b).css("top", "auto");
    $("#chatw" + b).css("left", 0);
    docked.push(b)
  }
  redock()
}
function chat_title_click(a, c) {
  var b = a + (c || "");
  if (in_arr(b, docked)) {
    toggle_chat_window(a, c)
  }
}
function redock() {
  for (var a = 0; a < docked.length; a++) {
    var b = docked[a];
    $("#chatw" + b).css("bottom", 15 + a * 32);
    $("#chatw" + b).css("z-index", 70 - a)
  }
}
function open_chat_window(e, h, b) {
  if (no_html) {
    return
  }
  if (!h) {
    h = ""
  }
  var a = h,
    g = e + h,
    d = 70 + cwindows.length - docked.length,
    f = 'last_say="' + g + '"; if(event.keyCode==13) private_say("' + h + '",$(this).rfval())';
  if (e == "party") {
    a = "Party", f = 'last_say="' + g + '"; if(event.keyCode==13) party_say($(this).rfval())'
  }
  var c = "<div style='position:fixed; bottom: 0px; left: 0px; background: black; border: 5px solid gray; z-index: " + d + "' id='chatw" + g + "' onclick='last_say=\"" + g + "\"'>";
  c += "<div style='border-bottom: 5px solid gray; text-align: center; font-size: 24px; line-height: 24px; padding: 2px 6px 2px 6px;'><span style='float:left' class='clickable chatb" + g + "'		 onclick='toggle_chat_window(\"" + e + '","' + h + "\")'>+</span> <span id='chatt" + g + "' onclick='chat_title_click(\"" + e + '","' + h + "\")'>" + a + "</span> <span style='float: right' class='clickable' onclick='close_chat_window(\"" + e + '","' + h + "\")'>x</span></div>";
  c += "<div id='chatd" + g + "' class='chatlog'></div>";
  c += "<div style=''><input type='text' class='chatinput' id='chati" + g + "' onkeypress='" + f + "'/></div>";
  c += "</div>";
  $("body").append(c);
  docked.push(g);
  cwindows.push(g);
  if (b) {
    toggle_chat_window(e, h)
  }
  redock()
}
function hide_settings() {
  $("#content").html("");
  settings_shown = 0
}
function prop_line(e, d, b) {
  var a = "",
    c = "";
  if (!b) {
    b = {}
  }
  if (b.bold) {
    c = "font-weight: bold;"
  }
  if (is_string(b)) {
    a = b, b = {}
  }
  if (!a) {
    a = b.color || "grey"
  }
  return "<div><span style='color: " + a + "; " + c + "'>" + e + "</span>: " + d + "</div>"
}
function bold_prop_line(c, b, a) {
  if (!a) {
    a = {}
  }
  if (is_string(a)) {
    a = {
      color: a
    }
  }
  if (is_bold) {
    a.bold = true
  }
  return prop_line(c, b, a)
}
function render_party(b) {
  var a = "<div style='background-color: black; border: 5px solid gray; padding: 6px; font-size: 24px; display: inline-block' class='enableclicks'>";
  if (b) {
    a += "<div class='slimbutton block'>PARTY</div>";
    b.forEach(function(c) {
      a += "<div class='slimbutton block mt5' style='border-color:#703987' onclick='party_click(\"" + c + "\")'>" + c + "</div>"
    });
    a += "<div class='slimbutton block mt5'";
    a += 'onclick=\'socket.emit("party",{event:"leave"})\'>LEAVE</div>'
  }
  a += "</div>";
  $("#partylist").html(a);
  if (!b.length) {
    $("#partylist").hide()
  } else {
    $("#partylist").css("display", "inline-block")
  }
}
function render_character_sheet() {
  var a = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: left' class='disableclicks'>";
  a += "<div><span style='color:gray'>Class:</span> " + to_title(character.ctype) + "</div>";
  a += "<div><span style='color:gray'>Level:</span> " + character.level + "</div>";
  a += "<div><span style='color:gray'>XP:</span> " + to_pretty_num(character.xp) + " / " + to_pretty_num(character.max_xp) + "</div>";
  if (character.ctype == "priest") {
    a += "<div><span style='color:gray'>Heal:</span> " + character.attack + "</div>";
    a += "<div><span style='color:gray'>Attack:</span> " + round(character.attack * 0.4) + "</div>"
  } else {
    a += "<div><span style='color:gray'>Attack:</span> " + character.attack + "</div>"
  }
  a += "<div><span style='color:gray'>Attack Speed:</span> " + round(character.frequency * 100) + "</div>";
  a += "<div><span style='color:gray'>Strength:</span> " + character.stats.str + "</div>";
  a += "<div><span style='color:gray'>Intelligence:</span> " + character.stats["int"] + "</div>";
  a += "<div><span style='color:gray'>Dexterity:</span> " + character.stats.dex + "</div>";
  a += "<div><span style='color:gray'>Vitality:</span> " + character.stats.vit + "</div>";
  a += "<div><span style='color:gray'>Armor:</span> " + character.armor + " <span style='color:gray'>(" + parseInt((1 - damage_multiplier(character.armor)) * 10000) / 100 + "%)</span></div>";
  a += "<div><span style='color:gray'>Resistance:</span> " + character.resistance + " <span style='color:gray'>(" + parseInt((1 - damage_multiplier(character.resistance)) * 10000) / 100 + "%)</span></div>";
  a += "<div><span style='color:gray'>Speed:</span> " + character.speed + "</div>";
  a += "<div><span style='color:gray'>MP Cost:</span> " + character.mp_cost + "</div>";
  if (character.dreturn) {
    a += "<div><span style='color:gray'>Damage Return:</span> " + character.dreturn + "%</div>"
  }
  if (character.reflection) {
    a += "<div><span style='color:gray'>Reflection:</span> " + character.reflection + "%</div>"
  }
  if (character.evasion) {
    a += "<div><span style='color:gray'>Evasion:</span> " + character.evasion + "%</div>"
  }
  if (character.crit) {
    a += "<div><span style='color:gray'>Crit:</span> " + character.crit + "%</div>"
  }
  if (character.apiercing) {
    a += "<div><span style='color:gray'>Armor Piercing:</span> " + character.apiercing + "</div>"
  }
  if (character.rpiercing) {
    a += "<div><span style='color:gray'>Resistance Piercing:</span> " + character.rpiercing + "</div>"
  }
  if (character.goldm != 1) {
    a += "<div><span style='color:gray'>Gold:</span> " + round(character.goldm * 100) + "%</div>"
  }
  if (character.xpm != 1) {
    a += "<div><span style='color:gray'>Experience:</span> " + round(character.xpm * 100) + "%</div>"
  }
  if (character.luckm != 1) {
    a += "<div><span style='color:gray'>Luck:</span> " + round(character.luckm * 100) + "%</div>"
  }
  a += "</div>";
  $("#rightcornerui").html(a);
  topright_npc = "character"
}
function render_abilities() {}
function render_conditions(b) {
  var a = "<div style='margin-top: 5px; margin-bottom: -5px; margin-left: -2px'>",
    c = 0;
  for (var e in b.s) {
    var d = G.conditions[e];
    if (!d || !d.ui) {
      continue
    }
    if (c > 0 && !(c % 2)) {
      a += "<div></div>"
    }
    c += 1;
    a += item_container({
      skin: d.skin,
      onclick: "condition_click('" + e + "')"
    })
  }
  a += "</div>";
  if (c) {
    $(".renderedinfo").append(a)
  }
}
function render_info(h, f) {
  if (!f) {
    f = []
  }
  var e = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top' class='renderedinfo'>";
  for (var d = 0; d < h.length; d++) {
    var g = h[d],
      a = "";
    var b = g.color || "white";
    if (g.afk && g.afk == "bot") {
      a = " <span class='gray'>[BOT]</span>"
    } else {
      if (g.afk && g.afk == "code") {
        a = " <span class='gray'>[CODE]</span>"
      } else {
        if (g.afk) {
          a = " <span class='gray'>[AFK]</span>"
        }
      }
    }
    if (g.cursed) {
      a = " <span style='color: #7D4DAA'>[C]</span>"
    }
    if (g.poisoned) {
      a = " <span style='color: #45993F'>[P]</span>"
    }
    if (g.stunned) {
      a = " <span style='color: #FF9601'>[STUN]</span>"
    }
    if (g.line) {
      e += "<span class='cbold' style='color: " + b + "'>" + g.line + "</span>" + a + "<br />"
    } else {
      e += "<span class='cbold' style='color: " + b + "'>" + g.name + "</span>: " + g.value + a + "<br />"
    }
  }
  for (var d = 0; d < f.length; d++) {
    var c = f[d];
    var b = c.color || "white";
    e += "<span style='color: " + b + "' class='clickable cbold' onclick=\"" + c.onclick + '">' + c.name + "</span>";
    if (c.pm_onclick) {
      e += " <span style='color: " + ("#276bc5" || b) + "' class='clickable cbold' onclick=\"" + c.pm_onclick + '">PM</span>'
    }
    e += "<br />"
  }
  e += "</div>";
  $("#topleftcornerui").html(e)
}
function render_slots(f) {
  function c(m, g, l) {
    if (!l) {
      l = 0.4
    }
    if (f.slots[m]) {
      var j = f.slots[m];
      var k = "item" + randomStr(10),
        h = G.items[j.name],
        i = j.skin || h.skin;
      if (j.expires) {
        i = h.skin_a
      }
      if ((j.name == "tristone" || j.name == "darktristone") && (f.skin.startsWith("mm_") || f.skin.startsWith("mf_") || f.skin.startsWith("tm_") || f.skin.startsWith("tf_"))) {
        i = h.skin_a
      }
      e += item_container({
        skin: i,
        onclick: "slot_click('" + m + "')",
        def: h,
        id: k,
        draggable: f.me,
        sname: f.me && m,
        shade: g,
        s_op: l,
        slot: m
      }, j)
    } else {
      e += item_container({
        size: 40,
        draggable: f.me,
        shade: g,
        s_op: l,
        slot: m
      })
    }
  }
  var a = f.me;
  var e = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; margin-left: 5px'>";
  if (f.stand) {
    e += "<div class='cmerchant'>";
    for (var d = 0; d < 4; d++) {
      e += "<div>";
      for (var b = 0; b < 4; b++) {
        c("trade" + ((d * 4) + b + 1), "shade_gold", 0.25)
      }
      e += "</div>"
    }
    e += "</div>"
  }
  if (f.stand) {
    e += "<div class='cmerchant hidden'>"
  }
  e += "<div>";
  c("earring1", "shade_earring");
  c("helmet", "shade_helmet", 0.5);
  c("earring2", "shade_earring");
  c("amulet", "shade_amulet");
  e += "</div>";
  e += "<div>";
  c("mainhand", "shade_mainhand", 0.36);
  c("chest", "shade_chest");
  c("offhand", "shade_offhand");
  c("cape", "shade20_cape");
  e += "</div>";
  e += "<div>";
  c("ring1", "shade_ring");
  c("pants", "shade_pants", 0.5);
  c("ring2", "shade_ring");
  c("orb", "shade20_orb");
  e += "</div>";
  e += "<div>";
  c("belt", "shade_belt");
  c("shoes", "shade_shoes", 0.5);
  c("gloves", "shade_gloves");
  c("elixir", "shade20_elixir");
  e += "</div>";
  if ((f.me && f.slots.trade1 !== undefined || (f.slots.trade1 || f.slots.trade2 || f.slots.trade3 || f.slots.trade4)) && !f.stand) {
    e += "<div>";
    c("trade1", "shade_gold", 0.25);
    c("trade2", "shade_gold", 0.25);
    c("trade3", "shade_gold", 0.25);
    c("trade4", "shade_gold", 0.25);
    e += "</div>"
  }
  if (f.stand) {
    e += "</div>"
  }
  e += "</div>";
  $("#topleftcornerui").append(e)
}
function render_transports_npc() {
  reset_inventory(1);
  topleft_npc = "transports";
  rendered_target = topleft_npc;
  e_item = null;
  var a = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top;'>";
  a += "<div class='clickable' onclick='transport_to(\"main\",9)'>&gt; New Town</div>";
  a += "<div class='clickable' onclick='transport_to(\"winterland\",1)'>&gt; Winterland</div>";
  a += "<div class='clickable' onclick='transport_to(\"halloween\",1)'>&gt; Spooky Forest</div>";
  a += "<div class='clickable' onclick='transport_to(\"underworld\")'>&gt; Underworld</div>";
  a += "<div class='clickable' onclick='transport_to(\"desert\")'>&gt; Desertland <span style='color: #D2CB7E'>[Soon!]</span></div>";
  a += "</div>";
  $("#topleftcornerui").html(a)
}
function render_gold_npc() {
  reset_inventory(1);
  topleft_npc = "gold";
  rendered_target = topleft_npc;
  e_item = null;
  var a = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center' onclick='stpr(event); cfocus(\".npcgold\")'>";
  a += "<div style='font-size: 36px; margin-bottom: 10px'><span style='color:gold'>GOLD:</span> " + (character.user && to_pretty_num(character.user.gold) || "Unavailable") + "</div>";
  a += "<div style='font-size: 36px; margin-bottom: 10px'><span style='color:gray'>Amount:</span> <div contenteditable='true' class='npcgold inline-block'>0</div></div>";
  a += "<div><div class='gamebutton clickable' onclick='deposit()'>DEPOSIT</div><div class='gamebutton clickable ml5' onclick='withdraw()'>WITHDRAW</div></div>";
  a += "</div>";
  $("#topleftcornerui").html(a);
  cfocus(".npcgold")
}
var last_rendered_items = "items0";

function render_items_npc(l) {
  if (!character.user) {
    return
  }
  if (!l) {
    l = last_rendered_items
  }
  if (l && !character.user[l]) {
    render_interaction("unlock_" + l);
    topleft_npc = "items";
    rendered_target = topleft_npc;
    last_rendered_items = l;
    return
  }
  last_rendered_items = l;
  reset_inventory(1);
  topleft_npc = "items";
  rendered_target = topleft_npc;
  var g = [],
    m = 0,
    k = character.user[l] || [];
  var e = "<div style='background-color: black; border: 5px solid gray; padding: 2px; font-size: 24px; display: inline-block' class='dcontain'>";
  for (var d = 0; d < Math.ceil(max(character.isize, k.length) / 7); d++) {
    e += "<div>";
    for (var c = 0; c < 7; c++) {
      var h = null;
      if (m < k.length) {
        h = k[m++]
      } else {
        m++
      }
      if (h) {
        var a = "citem" + (m - 1),
          o = G.items[h.name],
          n = o.skin;
        if (h.expires) {
          n = o.skin_a
        }
        e += item_container({
          skin: n,
          def: o,
          id: "str" + a,
          draggable: true,
          strnum: m - 1,
          snum: m - 1
        }, h);
        g.push({
          id: a,
          item: o,
          name: h.name,
          actual: h,
          num: m - 1,
          npc: true
        })
      } else {
        e += item_container({
          size: 40,
          draggable: true,
          strnum: m - 1
        })
      }
    }
    e += "</div>"
  }
  e += "</div><div id='storage-item' style='display: inline-block; vertical-align: top; margin-left: 5px'></div>";
  $("#topleftcornerui").html(e);
  for (var d = 0; d < g.length; d++) {
    var b = g[d];

    function f(i) {
      return function() {
        render_item("#storage-item", i)
      }
    }
    $("#str" + b.id).on("click", f(b)).addClass("clickable")
  }
  if (!inventory) {
    render_inventory()
  }
}
function render_inventory() {
  var g = 0,
    b = "text-align: right";
  if (inventory) {
    $("#bottomleftcorner").html("");
    inventory = false;
    return
  }
  var e = "<div style='background-color: black; border: 5px solid gray; padding: 2px; font-size: 24px; display: inline-block; vertical-align: bottom' class='dcontain'>";
  if (c_enabled) {
    e += "<div style='padding: 4px; display: inline-block' class='clickable'>";
    e += "<a href='https://adventure.land/shells' class='cancela' target='_blank'><span class='cbold' style='color: " + colors.cash + "'>SHELLS</span>: <span class='cashnum'>" + to_pretty_num(character.cash || 0) + "</span></a></div>";
    b = " display: inline-block; float: right"
  }
  e += "<div style='padding: 4px;" + b + "'><span class='cbold' style='color: gold'>GOLD</span>: <span class='goldnum'>" + to_pretty_num(character.gold + ((new Date()).getDate() == 1 && (new Date()).getMonth() == 3 ? 1014201800 : 0)) + "</span></div>";
  e += "<div style='border-bottom: 5px solid gray; margin-bottom: 2px; margin-left: -5px; margin-right: -5px'></div>";
  for (var d = 0; d < Math.ceil(max(character.isize, character.items.length) / 7); d++) {
    e += "<div>";
    for (var c = 0; c < 7; c++) {
      var f = null;
      if (g < character.items.length) {
        f = character.items[g++]
      } else {
        g++
      }
      if (f) {
        var a = "citem" + (g - 1),
          k = G.items[f.name] || {
            skin: "test",
            name: "Unrecognized Item"
          },
          h = f.skin || k.skin;
        if (f.expires) {
          h = k.skin_a
        }
        e += item_container({
          skin: h,
          onclick: "inventory_click(" + (g - 1) + ")",
          def: k,
          id: a,
          draggable: true,
          num: g - 1,
          cnum: g - 1
        }, f)
      } else {
        e += item_container({
          size: 40,
          draggable: true,
          cnum: g - 1
        })
      }
    }
    e += "</div>"
  }
  e += "</div><div class='inventory-item' style='display: inline-block; vertical-align: top; margin-left: 5px'></div>";
  inventory = true;
  $("#bottomleftcorner").html(e)
}
function render_craftsman() {
  var a = "stick",
    c = "CRAFT";
  reset_inventory(1);
  topleft_npc = "craftsman";
  rendered_target = topleft_npc;
  cr_items = e_array(9), cr_last = 0;
  var b = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center'>";
  b += "<div>";
  b += item_container({
    shade: a,
    cid: "critem0",
    s_op: 0.3,
    draggable: false,
    droppable: true
  });
  b += item_container({
    shade: a,
    cid: "critem1",
    s_op: 0.3,
    draggable: false,
    droppable: true
  });
  b += item_container({
    shade: a,
    cid: "critem2",
    s_op: 0.3,
    draggable: false,
    droppable: true
  });
  b += "</div>";
  b += "<div>";
  b += item_container({
    shade: a,
    cid: "critem3",
    s_op: 0.3,
    draggable: false,
    droppable: true
  });
  b += item_container({
    shade: a,
    cid: "critem4",
    s_op: 0.3,
    draggable: false,
    droppable: true
  });
  b += item_container({
    shade: a,
    cid: "critem5",
    s_op: 0.3,
    draggable: false,
    droppable: true
  });
  b += "</div>";
  b += "<div class='mb5'>";
  b += item_container({
    shade: a,
    cid: "critem6",
    s_op: 0.3,
    draggable: false,
    droppable: true
  });
  b += item_container({
    shade: a,
    cid: "critem7",
    s_op: 0.3,
    draggable: false,
    droppable: true
  });
  b += item_container({
    shade: a,
    cid: "critem8",
    s_op: 0.3,
    draggable: false,
    droppable: true
  });
  b += "</div>";
  b += "<div><div class='gamebutton clickable' onclick='draw_trigger(function(){ render_craftsman(); reset_inventory(); });'>RESET</div> <div class='gamebutton clickable' onclick='craft()'>" + c + "</div></div>";
  b += "</div>";
  $("#topleftcornerui").html(b);
  if (!inventory) {
    render_inventory()
  }
}
function render_dismantler() {
  var a = "fclaw",
    c = "DISMANTLE";
  reset_inventory(1);
  topleft_npc = "dismantler";
  rendered_target = topleft_npc;
  ds_item = null;
  var b = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center'>";
  b += "<div>";
  b += item_container({
    shade: a,
    cid: "dsitem",
    s_op: 0.3,
    draggable: false,
    droppable: true
  });
  b += "</div>";
  b += "<div style='margin-top: 12px'><div class='gamebutton clickable' onclick='dismantle()'>" + c + "</div></div>";
  b += "</div>";
  $("#topleftcornerui").html(b);
  if (!inventory) {
    render_inventory()
  }
}
function render_recipe(b, a) {
  if (b == "craft") {
    render_item("#recipe-item", {
      item: G.items[a],
      name: a,
      craft: true
    })
  } else {
    render_item("#recipe-item", {
      item: G.items[a],
      name: a,
      dismantle: true
    })
  }
}
function render_recipes() {
  topleft_npc = "recipes";
  rendered_target = topleft_npc;
  var b = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center'>";
  b += "<div class='clickable' onclick='render_craftsman()'>CRAFT</div>";
  for (var a in G.craft) {
    b += item_container({
      skin: G.items[a].skin,
      onclick: "render_recipe('craft','" + a + "')"
    }, {
      name: a
    })
  }
  b += "<div class='clickable' onclick='render_dismantler()'>DISMANTLE</div>";
  for (var a in G.dismantle) {
    b += item_container({
      skin: G.items[a].skin,
      onclick: "render_recipe('dismantle','" + a + "')"
    }, {
      name: a
    })
  }
  b += "</div><div id='recipe-item' style='display: inline-block; vertical-align: top; margin-left: 5px'></div>";
  $("#topleftcornerui").html(b)
}
function render_exchange_shrine(d) {
  var a = "shade_exchange",
    c = "EXCHANGE";
  reset_inventory(1);
  topleft_npc = "exchange";
  rendered_target = topleft_npc;
  exchange_type = d;
  if (d == "leather") {
    a = "leather", c = "GIVE"
  }
  if (d == "lostearring") {
    a = "lostearring", c = "PROVIDE"
  }
  if (d == "mistletoe") {
    a = "mistletoe", c = "GIVE IT"
  }
  if (d == "candycane") {
    a = "candycane", c = "FEED"
  }
  if (d == "ornament") {
    a = "ornament", c = "GIVE"
  }
  if (d == "seashell") {
    a = "seashell", c = "GIVE"
  }
  if (d == "gemfragment") {
    a = "gemfragment", c = "PROVIDE"
  }
  e_item = null;
  var b = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center'>";
  b += "<div class='ering ering1 mb10'>";
  b += "<div class='ering ering2'>";
  b += "<div class='ering ering3'>";
  b += item_container({
    shade: a,
    cid: "eitem",
    s_op: 0.3,
    draggable: false,
    droppable: true
  });
  b += "</div>";
  b += "</div>";
  b += "</div>";
  b += "<div><div class='gamebutton clickable' onclick='exchange()'>" + c + "</div></div>";
  b += "</div>";
  $("#topleftcornerui").html(b);
  if (!inventory) {
    render_inventory()
  }
}
function render_shells_buyer() {
  topleft_npc = "buyshells";
  rendered_target = topleft_npc;
  var a = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: left'>",
    b = "";
  a += "<div><span style='color: #5DAC40'>10</span> Shells = <span style='color: gold'>1,500,000</span> <span style='color: #71AF83' class='clickable' onclick='buy_shells(10)'>BUY</span></div>";
  a += "<div><span style='color: #5DAC40'>100</span> Shells = <span style='color: gold'>15,000,000</span> <span style='color: #71AF83' class='clickable' onclick='buy_shells(100)'>BUY</span></div>";
  a += "<div><span style='color: #5DAC40'>500</span> Shells = <span style='color: gold'>75,000,000</span> <span style='color: #71AF83' class='clickable' onclick='buy_shells(500)'>BUY</span></div>";
  a += "<div><span style='color: #5DAC40'>1,000</span> Shells = <span style='color: gold'>150,000,000</span> <span style='color: #71AF83' class='clickable' onclick='buy_shells(1000)'>BUY</span></div>";
  if (!is_electron) {
    b = "<a href='https://adventure.land/shells' class='cancela' target='_blank'><span class='clickable' onclick='rendered_target=null;' style='color: #359ECF'>Buy With $</span></a> | "
  }
  a += "<div>" + b + "<span class='clickable' onclick='topleft_npc=false;' style='color: #555556'>Nope</span></div>";
  a += "</div>";
  $("#topleftcornerui").html(a);
  if (!inventory) {
    render_inventory()
  }
}
function render_upgrade_shrine() {
  reset_inventory(1);
  topleft_npc = "upgrade";
  rendered_target = topleft_npc;
  u_item = null, u_scroll = null, u_offering = null;
  var a = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top'>";
  a += "<div class='mb5' align='center'>";
  a += "<div>";
  a += item_container({
    draggable: false,
    droppable: true,
    shade: "shade_uweapon",
    cid: "uweapon"
  });
  a += "</div>";
  a += "<div>";
  a += item_container({
    draggable: false,
    droppable: true,
    shade: "shade_offering",
    cid: "uoffering",
    s_op: 0.36
  });
  a += item_container({
    draggable: false,
    droppable: true,
    shade: "shade_scroll",
    cid: "uscroll"
  });
  a += "</div>";
  a += "</div>";
  a += "<div class='gamebutton clickable' onclick='draw_trigger(function(){ render_upgrade_shrine(); reset_inventory(); });'>RESET</div>";
  a += "<div class='gamebutton clickable ml5' onclick='upgrade()'>UPGRADE</div>";
  a += "</div>";
  $("#topleftcornerui").html(a);
  if (!inventory) {
    render_inventory()
  }
}
function render_compound_shrine() {
  reset_inventory(1);
  topleft_npc = "compound";
  rendered_target = topleft_npc;
  c_items = e_array(3), c_scroll = null, c_offering = null;
  c_last = 0;
  var a = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top'>";
  a += "<div class='mb5' align='center'>";
  a += "<div>";
  a += item_container({
    draggable: false,
    droppable: true,
    shade: "shade_cring",
    cid: "compound0"
  });
  a += item_container({
    draggable: false,
    droppable: true,
    shade: "shade_cring",
    cid: "compound1"
  });
  a += item_container({
    draggable: false,
    droppable: true,
    shade: "shade_cring",
    cid: "compound2"
  });
  a += "</div>";
  a += "<div>";
  a += item_container({
    draggable: false,
    droppable: true,
    shade: "shade_offering",
    cid: "coffering",
    s_op: 0.36
  });
  a += item_container({
    draggable: false,
    droppable: true,
    shade: "shade_cscroll",
    cid: "cscroll"
  });
  a += "</div>";
  a += "</div>";
  a += "<div class='gamebutton clickable' onclick='draw_trigger(function(){ render_compound_shrine(); reset_inventory(); });'>RESET</div>";
  a += "<div class='gamebutton clickable ml5' onclick='compound()'>COMBINE</div>";
  a += "</div>";
  $("#topleftcornerui").html(a);
  if (!inventory) {
    render_inventory()
  }
}
function render_dice() {
  add_log("Dice!", "#B6A786")
}
function render_merchant(l, b) {
  reset_inventory(1);
  topleft_npc = "merchant";
  rendered_target = topleft_npc;
  merchant_id = l.id;
  var m = 0,
    h = [];
  var f = "<div style='background-color: black; border: 5px solid gray; padding: 2px; font-size: 24px; display: inline-block'>";
  for (var e = 0; e < 4; e++) {
    f += "<div>";
    for (var d = 0; d < 5; d++) {
      if (m < l.items.length && l.items[m++] && (c_enabled || !G.items[l.items[m - 1]].cash)) {
        var k = l.items[m - 1];
        var a = "item" + randomStr(10),
          n = G.items[k];
        f += item_container({
          skin: n.skin_a || n.skin,
          def: n,
          id: a,
          draggable: false,
          on_rclick: "buy('" + k + "')"
        });
        h.push({
          id: a,
          item: n,
          name: k,
          value: n.g,
          cash: n.cash
        })
      } else {
        f += item_container({
          size: 40,
          draggable: false,
          droppable: true
        })
      }
    }
    f += "</div>"
  }
  f += "</div>";
  f += "<div id='merchant-item' style='display: inline-block; vertical-align: top; margin-left: 5px'>" + (b && render_interaction(b, "return_html") || " ") + "</div>";
  $("#topleftcornerui").html(f);
  for (var e = 0; e < h.length; e++) {
    var c = h[e];

    function g(i) {
      return function() {
        render_item("#merchant-item", i)
      }
    }
    $("#" + c.id).on("click", g(c)).addClass("clickable")
  }
}
function render_token_exchange(c) {
  reset_inventory(1);
  topleft_npc = "token_exchange";
  rendered_target = topleft_npc;
  var n = 0,
    k = [],
    m = [c];
  var g = "<div style='background-color: black; border: 5px solid gray; padding: 2px; font-size: 24px; display: inline-block'>";
  for (var a in G.tokens[c]) {
    m.push(a)
  }
  for (var f = 0; f < 4; f++) {
    g += "<div>";
    for (var e = 0; e < 5; e++) {
      if (n < m.length && m[n++] && (c_enabled || !G.items[m[n - 1]].cash)) {
        var l = m[n - 1];
        var b = "item" + randomStr(10),
          o = G.items[l];
        g += item_container({
          skin: o.skin_a || o.skin,
          def: o,
          id: b,
          draggable: false
        });
        k.push({
          id: b,
          item: o,
          name: l,
          token: c
        })
      } else {
        g += item_container({
          size: 40,
          draggable: false,
          droppable: true
        })
      }
    }
    g += "</div>"
  }
  g += "</div>";
  g += "<div id='merchant-item' style='display: inline-block; vertical-align: top; margin-left: 5px'></div>";
  $("#topleftcornerui").html(g);
  for (var f = 0; f < k.length; f++) {
    var d = k[f];

    function h(i) {
      return function() {
        render_item("#merchant-item", i)
      }
    }
    $("#" + d.id).on("click", h(d)).addClass("clickable")
  }
}
function render_computer(a) {
  var b = "";
  b += '<div style="color: #32A3B0">CONNECTED.</div>';
  b += "<div onclick='render_upgrade_shrine()' class='clickable' style='color: #E4E4E4'><span style='color: #BA61A4'>&gt;</span> UPGRADE</div>";
  b += "<div onclick='render_compound_shrine()' class='clickable' style='color: #E4E4E4'><span style='color: #BA61A4'>&gt;</span> COMPOUND</div>";
  b += "<div onclick='render_exchange_shrine()' class='clickable' style='color: #E4E4E4'><span style='color: #BA61A4'>&gt;</span> EXCHANGE</div>";
  b += "<div onclick='render_interaction(\"crafting\");' class='clickable' style='color: #E4E4E4'><span style='color: #BA61A4'>&gt;</span> CRAFTING</div>";
  b += "<div onclick='render_merchant(G.npcs.pots)' class='clickable' style='color: #E4E4E4'><span style='color: #BA61A4'>&gt;</span> POTIONS</div>";
  b += "<div onclick='render_merchant(G.npcs.scrolls)' class='clickable' style='color: #E4E4E4'><span style='color: #BA61A4'>&gt;</span> SCROLLS</div>";
  b += "<div onclick='render_merchant(G.npcs.basics)' class='clickable' style='color: #E4E4E4'><span style='color: #BA61A4'>&gt;</span> BASICS</div>";
  b += "<div onclick='render_merchant(G.npcs.premium)' class='clickable' style='color: #E4E4E4'><span style='color: #BA61A4'>&gt;</span> PREMIUM</div>";
  a.html(b)
}
function render_code_gallery() {
  var a = "";
  G.codes.forEach(function(b) {
    a += "<div class='gamebutton'>" + (b.name || b.key) + "</div>"
  });
  a += "<div style='border: 4px gray solid;'>";
  G.codes[0].list.forEach(function(b) {
    a += '<div onclick=\'api_call("load_gcode",{file:"' + b[0] + "\"});'>" + b[1] + "</div>"
  });
  a += "</div>";
  show_modal(a)
}
function render_tutorial_stepv1(a) {
  if (!a) {
    a = {}
  }
  a.title = "[1/24] Move";
  a.main = "Welcome to the first step of the tutorial. In this step, we are going to move! Now move your character near the green goo's by clicking on the map and walking below the town!";
  a.code = "Using the CODE feature. You can use the `move` function, or, the more costly `smart_move` function.";
  var b = "";
  if (a.title) {
    b += "<div style='border: 5px solid #65A7E6; background-color: #E6E6E6; color: #333333; margin: 3px; padding: 5px; font-size: 24px; display: inline-block'>" + a.title + "</div>"
  }
  if (a.main) {
    b += "<div style='border: 5px solid gray; background-color: #E6E6E6; color: #333333; margin: 3px; padding: 5px; font-size: 24px;'>" + a.main + "</div>"
  }
  if (a.code) {
    b += "<div style='border: 5px solid #E4738A; background-color: #E6E6E6; color: #333333; margin: 3px; padding: 5px; font-size: 24px;'>" + a.code + "</div>"
  }
  show_modal(b)
}
function render_skill(a, e, c) {
  if (!c) {
    c = {}
  }
  var f = c.actual || {},
    d = "";
  var b = G.skills[e];
  d += "<div style='background-color: black; border: 5px solid gray; font-size: 24px; display: inline-block; padding: 20px; line-height: 24px; max-width: 240px; " + (c.styles || "") + "'>";
  if (!b) {
    d += e
  } else {
    d += "<div style='color: #4EB7DE; display: inline-block; border-bottom: 2px dashed gray; margin-bottom: 3px' class='cbold'>" + b.name + "</div>";
    if (b.explanation) {
      d += "<div style='color: #C3C3C3'>" + b.explanation + "</div>";
      if (b.duration) {
        d += bold_prop_line("Duration", (b.duration / 1000) + " seconds", "gray")
      }
      if (b.cooldown && (b.cooldown / 1000)) {
        d += bold_prop_line("Cooldown", (b.cooldown / 1000) + " seconds", "gray")
      }
      if (b.mp) {
        d += bold_prop_line("MP", b.mp, colors.mp)
      }
      if (b.level) {
        d += bold_prop_line("Level Requirement", b.level, "gray")
      }
    }
  }
  d += "</div>";
  $(a).html(d)
}
function render_computer_network(a) {
  var b = "<div style='background-color: black; border: 5px solid gray; font-size: 24px; display: inline-block; padding: 20px; line-height: 24px; max-width: 240px;' class='buyitem'><div class='computernx'></div></div>";
  $(a).html(b);
  render_computer($(".computernx"))
}
function render_item(p, b) {
  var s = b.item || {
    skin: "test",
    name: "Unrecognized Item",
    explanation: "Hmm. Curious."
  },
    t = b.name,
    o = "gray",
    n = b.value,
    f = b.cash,
    g = s.name,
    c = false;
  var m = b && b.actual;
  var d = calculate_item_properties(s, m || {}),
    a = calculate_item_grade(s, m || {});
  var h = "";
  h += "<div style='background-color: black; border: 5px solid gray; font-size: 24px; display: inline-block; padding: 20px; line-height: 24px; max-width: 240px; " + (b.styles || "") + "' class='buyitem'>";
  if (!s) {
    h += "ITEM"
  } else {
    o = "#E4E4E4";
    if (s.grade == "mid") {
      o = "blue"
    }
    if (m && m.p == "shiny") {
      g = "Shiny " + g
    }
    if (d.level) {
      g += " +" + d.level
    }
    if (b.thumbnail) {
      h += "<div>" + item_container({
        skin: s.skin,
        def: s
      }) + "</div>"
    }
    h += "<div style='color: " + o + "; display: inline-block; border-bottom: 2px dashed gray; margin-bottom: 3px' class='cbold'>" + g + "</div>";
    (s.gives || []).forEach(function(i) {
      if (i[0] == "hp") {
        h += bold_prop_line("HP", "+" + i[1], colors.hp)
      }
      if (i[0] == "mp") {
        h += bold_prop_line("MP", "+" + i[1], colors.mp)
      }
    });
    if (d.gold) {
      h += bold_prop_line("Gold", (d.gold > 0 && "+" || "") + d.gold + "%", "gold")
    }
    if (d.luck) {
      h += bold_prop_line("Luck", (d.luck > 0 && "+" || "") + d.luck + "%", "#5DE376")
    }
    if (d.xp) {
      h += bold_prop_line("XP", "+" + d.xp + "%", "#1E73DE")
    }
    if (d.lifesteal) {
      h += bold_prop_line("Lifesteal", d.lifesteal + "%", "#9A1D27")
    }
    if (d.evasion) {
      h += bold_prop_line("Evasion", d.evasion + "%", "#7AC0F5")
    }
    if (d.reflection) {
      h += bold_prop_line("Reflection", d.reflection + "%", "#B484E5")
    }
    if (d.dreturn) {
      h += bold_prop_line("D.Return", d.dreturn + "%", "#E94959")
    }
    if (d.crit) {
      h += bold_prop_line("Crit", d.crit + "%", "#E52967")
    }
    if (d.attack) {
      h += bold_prop_line("Damage", d.attack, colors.attack)
    }
    if (d.range) {
      h += bold_prop_line("Range", "+" + d.range, colors.range)
    }
    if (d.hp) {
      h += bold_prop_line("HP", d.hp, colors.hp)
    }
    if (d.str) {
      h += bold_prop_line("Strength", d.str, colors.str)
    }
    if (d["int"]) {
      h += bold_prop_line("Intelligence", d["int"], colors["int"])
    }
    if (d.dex) {
      h += bold_prop_line("Dexterity", d.dex, colors.dex)
    }
    if (d.vit) {
      h += bold_prop_line("Vitality", d.vit, colors.hp)
    }
    if (d.mp) {
      h += bold_prop_line("MP", d.mp, colors.mp)
    }
    if (d.mp_cost) {
      h += bold_prop_line("MP Cost", d.mp_cost, colors.mp)
    }
    if (d.stat) {
      h += bold_prop_line("Stat", d.stat)
    }
    if (d.armor) {
      h += bold_prop_line("Armor", d.armor, colors.armor)
    }
    if (d.apiercing) {
      h += bold_prop_line("A.Piercing", d.apiercing, colors.armor)
    }
    if (d.rpiercing) {
      h += bold_prop_line("R.Piercing", d.rpiercing, colors.resistance)
    }
    if (d.resistance) {
      h += bold_prop_line("Resistance", d.resistance, colors.resistance)
    }
    if (s.wspeed == "slow") {
      h += bold_prop_line("Speed", "Slow", "gray")
    }
    if (d.speed) {
      h += bold_prop_line(s.wtype && "Run Speed" || "Speed", ((d.speed > 0) && "+" || "") + d.speed, colors.speed)
    }
    if (d.frequency) {
      h += bold_prop_line("A.Speed", d.frequency, "#3BE681")
    }
    if (d.charisma) {
      h += bold_prop_line("Charisma", d.charisma, "#4DB174")
    }
    if (d.awesomeness) {
      h += bold_prop_line("Awesomeness", d.awesomeness, "#FFDE2F")
    }
    if (d.bling) {
      h += bold_prop_line("Bling", d.bling, "#A4E6FF")
    }
    if (d.cuteness) {
      h += bold_prop_line("Cuteness", d.cuteness, "#FD82F0")
    }
    if (a == 1 && s.type != "booster") {
      h += bold_prop_line("Grade", "High", "#696354")
    }
    if (a == 2 && s.type != "booster") {
      h += bold_prop_line("Grade", "Rare", "#6668AC")
    }
    if (m && s.type == "elixir" && b.slot == "elixir") {
      var e = round((-msince(new Date(m.expires))) / (6)) / 10;
      h += bold_prop_line("Hours", e, "gray")
    } else {
      if (s.type == "elixir") {
        h += bold_prop_line("Hours", s.duration, "gray")
      }
    }
    if (s.ability) {
      if (s.ability == "bash") {
        h += bold_prop_line("Ability", "Bash", colors.ability);
        h += "<div style='color: #C3C3C3'>Stuns the opponent for " + d.attr1 + " seconds with " + d.attr0 + "% chance.</div>"
      }
      if (s.ability == "freeze") {
        h += bold_prop_line("Ability", "Freeze", "#2EBCE2");
        h += "<div style='color: #C3C3C3'>Freezes the opponent with a " + d.attr0 + "% chance.</div>"
      }
      if (s.ability == "secondchance") {
        h += bold_prop_line("Ability", "Second Chance", colors.ability);
        h += "<div style='color: #C3C3C3'>Avoid death with a " + d.attr0 + "% chance.</div>"
      }
      if (s.ability == "sugarrush") {
        h += bold_prop_line("Ability", "Sugar Rush", "#D64770");
        h += "<div style='color: #C3C3C3'>Trigger a Sugar Rush on attack with 0.25% chance. Gain 240 Attack Speed for 10 seconds!</div>"
      }
    }
    if (s.explanation) {
      h += "<div style='color: #C3C3C3'>" + s.explanation + "</div>"
    }
    if (b.minutes) {
      h += bold_prop_line("Minutes", b.minutes, "gray")
    }
    if (b.trade && m) {
      h += "<div style='margin-top: 5px'>";
      if ((m.q || 1) > 1) {
        h += "<div><span class='gray'>Q:</span> <div class='inline-block tradenum' contenteditable=true data-q='" + m.q + "'>" + m.q + "</div></div>"
      }
      h += "<div><span style='color:gold'>GOLD" + (((m.q || 1) > 1) && " [EACH]" || "") + ":</span> <div class='inline-block sellprice editable' contenteditable=true>1</div></div>";
      h += "<div><span class='clickable' onclick='trade(\"" + b.slot + '","' + b.num + '",$(".sellprice").html(),$(".tradenum").html())\'>PUT UP FOR SALE</span></div>';
      h += "</div>"
    }
    if (in_arr(b.slot, trade_slots) && m && m.price && b.from_player) {
      c = true;
      if ((m.q || 1) > 1) {
        h += "<div><span class='gray'>Q:</span> <div class='inline-block tradenum' contenteditable=true data-q='1'>1</div></div>"
      }
      h += "<div style='color: gold'>" + to_pretty_num(m.price) + " GOLD" + ((m.q || 1) > 1 && " <span style='color: white'>[EACH]</span>" || "") + "</div>";
      h += "<div><span class='clickable' onclick='trade_buy(\"" + b.slot + '","' + b.from_p