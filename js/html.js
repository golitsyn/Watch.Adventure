var u_item = null,
  u_scroll = null,
  u_offering = null,
  c_items = e_array(3),
  c_scroll = null,
  c_offering = null,
  c_last = 0,
  e_item = null,
  p_item = null,
  cr_items = e_array(9),
  cr_last = 0,
  ds_item = null;
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
function render_party_old(b) {
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
function render_party() {
  var b = "";
  for (var a in party) {
    var c = party[a];
    b += " <div class='gamebutton' style='padding: 6px 8px 6px 8px; font-size: 24px; line-height: 18px' onclick='party_click(\"" + a + "\")'>";
    b += sprite_image(c.skin);
    if (c.rip) {
      b += "<div style='color:gray'>RIP</div>"
    } else {
      b += "<div>" + a.substr(0, 3).toUpperCase() + "</div>"
    }
    b += "</div>"
  }
  $("#newparty").html(b);
  if (!party_list.length) {
    $("#newparty").hide()
  } else {
    $("#newparty").show()
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
  if (character.miss) {
    a += "<div><span style='color:gray'>Miss:</span> " + character.miss + "%</div>"
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
function render_conditions(b) {
  var a = "<div style='margin-top: 5px; margin-bottom: -5px; margin-left: -2px'>",
    c = 0;
  for (var f in b.s) {
    var e = G.conditions[f],
      d = b.s[f];
    if (!e || (!e.ui && (!d.s || d.s < 20))) {
      continue
    }
    if (c > 0 && !(c % 2)) {
      a += "<div></div>"
    }
    c += 1;
    a += item_container({
      skin: e.skin,
      onclick: "condition_click('" + f + "')"
    }, d)
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
  function c(n, g, m) {
    if (!m) {
      m = 0.4
    }
    if (f.slots[n]) {
      var k = f.slots[n];
      var l = "item" + randomStr(10),
        h = G.items[k.name],
        j = k.skin || h.skin;
      if (k.expires) {
        j = h.skin_a
      }
      if ((k.name == "tristone" || k.name == "darktristone") && (f.skin.startsWith("mm_") || f.skin.startsWith("mf_") || f.skin.startsWith("tm_") || f.skin.startsWith("tf_"))) {
        j = h.skin_a
      }
      e += item_container({
        skin: j,
        onclick: "slot_click('" + n + "')",
        def: h,
        id: l,
        draggable: f.me,
        sname: f.me && n,
        shade: g,
        s_op: m,
        slot: n
      }, k)
    } else {
      e += item_container({
        size: 40,
        draggable: f.me,
        shade: g,
        s_op: m,
        slot: n
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

    function f(j) {
      return function() {
        render_item("#storage-item", j)
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
    s_op: 0.36,
    draggable: false,
    droppable: true
  });
  b += item_container({
    shade: a,
    cid: "critem1",
    s_op: 0.36,
    draggable: false,
    droppable: true
  });
  b += item_container({
    shade: a,
    cid: "critem2",
    s_op: 0.36,
    draggable: false,
    droppable: true
  });
  b += "</div>";
  b += "<div>";
  b += item_container({
    shade: a,
    cid: "critem3",
    s_op: 0.36,
    draggable: false,
    droppable: true
  });
  b += item_container({
    shade: a,
    cid: "critem4",
    s_op: 0.36,
    draggable: false,
    droppable: true
  });
  b += item_container({
    shade: a,
    cid: "critem5",
    s_op: 0.36,
    draggable: false,
    droppable: true
  });
  b += "</div>";
  b += "<div class='mb5'>";
  b += item_container({
    shade: a,
    cid: "critem6",
    s_op: 0.36,
    draggable: false,
    droppable: true
  });
  b += item_container({
    shade: a,
    cid: "critem7",
    s_op: 0.36,
    draggable: false,
    droppable: true
  });
  b += item_container({
    shade: a,
    cid: "critem8",
    s_op: 0.36,
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
    s_op: 0.36,
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
  i = 0;
  var a = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center'>";
  a += "<div class='clickable' onclick='render_craftsman()'>CRAFT</div>";
  object_sort(G.craft).forEach(function(c) {
    var b = c[0];
    a += item_container({
      skin: G.items[b].skin,
      onclick: "render_recipe('craft','" + b + "')"
    }, {
      name: b
    });
    i += 1;
    if (!(i % 6)) {
      a += "<div></div>"
    }
  });
  a += "<div class='clickable' onclick='render_dismantler()'>DISMANTLE</div>";
  i = 0;
  object_sort(G.dismantle).forEach(function(c) {
    var b = c[0];
    a += item_container({
      skin: G.items[b].skin,
      onclick: "render_recipe('dismantle','" + b + "')"
    }, {
      name: b
    });
    i += 1;
    if (!(i % 6)) {
      a += "<div></div>"
    }
  });
  a += "</div><div id='recipe-item' style='display: inline-block; vertical-align: top; margin-left: 5px'></div>";
  $("#topleftcornerui").html(a)
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
    s_op: 0.36,
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
function render_none_shrine(d) {
  var a = "cape0",
    c = "POOF";
  reset_inventory(1);
  topleft_npc = "none";
  rendered_target = topleft_npc;
  p_item = null;
  var b = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center'>";
  b += "<div class='ering ering1 mb10'>";
  b += "<div class='ering ering2'>";
  b += "<div class='ering ering3'>";
  b += item_container({
    shade: a,
    cid: "pitem",
    s_op: 0.5,
    draggable: false,
    droppable: true
  });
  b += "</div>";
  b += "</div>";
  b += "</div>";
  b += "<div><div class='gamebutton clickable' onclick='poof()'>" + c + "</div></div>";
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
    cid: "uweapon",
    s_op: 0.36
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
    cid: "uscroll",
    s_op: 0.36
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
    cid: "compound0",
    s_op: 0.36
  });
  a += item_container({
    draggable: false,
    droppable: true,
    shade: "shade_cring",
    cid: "compound1",
    s_op: 0.36
  });
  a += item_container({
    draggable: false,
    droppable: true,
    shade: "shade_cring",
    cid: "compound2",
    s_op: 0.36
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
    cid: "cscroll",
    s_op: 0.36
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

    function g(j) {
      return function() {
        render_item("#merchant-item", j)
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

    function h(j) {
      return function() {
        render_item("#merchant-item", j)
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
      if (b.mp) {
        d += bold_prop_line("MP", b.mp, colors.mp)
      }
      if (b.duration) {
        d += bold_prop_line("Duration", (b.duration / 1000) + " seconds", "gray")
      }
      if (b.cooldown && (b.cooldown / 1000)) {
        d += bold_prop_line("Cooldown", (b.cooldown / 1000) + " seconds", "gray")
      }
      if (b.range) {
        d += bold_prop_line("Range", b.range, "gray")
      }
      if (b.level) {
        d += bold_prop_line("Level Requirement", b.level, "gray")
      }
      if (b.type == "passive") {
        d += "<div><span style='color: #696C68;'>Passive</span></div>"
      }(b.levels || []).forEach(function(h) {
        var j = h[0],
          g = h[1];
        d += bold_prop_line("Output", g + (j > 0 && (" (Lv. " + j + ")")), "gray")
      });
      if (b.consume) {
        d += "<div style='margin: 4px 0px 0px -2px;'>" + item_container({
          skin: G.items[b.consume].skin,
          def: G.items[b.consume]
        }); + "</div>"
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
function render_secondhands(l) {
  reset_inventory(1);
  topleft_npc = "secondhands";
  if (l) {
    topleft_npc = l
  }
  rendered_target = topleft_npc;
  var m = 0,
    e = [],
    g = "sh_click";
  var d = "<div style='background-color: black; border: 5px solid gray; padding: 2px; font-size: 24px; display: inline-block'>";
  var k = secondhands;
  if (l) {
    k = lostandfound;
    if (l_page >= 1) {
      m += 19 + (l_page - 1) * 18
    }
    g = "lf_click"
  } else {
    if (s_page >= 1) {
      m += 19 + (s_page - 1) * 18
    }
  }
  for (var c = 0; c < 4; c++) {
    d += "<div>";
    for (var b = 0; b < 5; b++) {
      if (!l && c == 3 && b == 0 && s_page != 0) {
        d += item_container({
          skin: "left",
          onclick: "s_page=" + (s_page - 1) + "; render_secondhands();"
        }, {
          q: s_page,
          left: true
        })
      } else {
        if (!l && c == 3 && b == 4 && m < k.length - 1) {
          d += item_container({
            skin: "right",
            onclick: "s_page=" + (s_page + 1) + "; render_secondhands();"
          }, {
            q: s_page + 2
          })
        } else {
          if (l && c == 3 && b == 0 && l_page != 0) {
            d += item_container({
              skin: "left",
              onclick: "l_page=" + (l_page - 1) + "; render_secondhands('lostandfound');"
            }, {
              q: l_page,
              left: true
            })
          } else {
            if (l && c == 3 && b == 4 && m < k.length - 1) {
              d += item_container({
                skin: "right",
                onclick: "l_page=" + (l_page + 1) + "; render_secondhands('lostandfound');"
              }, {
                q: l_page + 2
              })
            } else {
              if (m < k.length && k[m++]) {
                var h = k[m - 1];
                var a = "secondhand" + (m - 1),
                  n = G.items[h.name];
                d += item_container({
                  skin: n.skin,
                  onclick: g + "(" + (m - 1) + ")",
                  def: n,
                  id: a,
                  draggable: false,
                  droppable: false
                }, h)
              } else {
                d += item_container({
                  size: 40,
                  draggable: false,
                  droppable: false
                })
              }
            }
          }
        }
      }
    }
    d += "</div>"
  }
  d += "</div>";
  d += "<div id='merchant-item' style='display: inline-block; vertical-align: top; margin-left: 5px'></div>";
  $("#topleftcornerui").html(d)
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
    if (s.type == "tarot" && s.minor) {
      h += "<img style='display: inline-block; margin: -8px 2px -6px -8px;' src='/images/cards/tarot/minor_arcana/tarot__" + s.minor + ".png' />"
    } else {
      if (s.type == "tarot") {
        h += "<img style='display: inline-block; margin: -8px 2px -6px -8px;' src='/images/cards/tarot/major_arcana/tarot__" + s.major + ".png' />"
      }
    }
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
    if (s.card) {
      h += "<div style='display:inline-block; vertical-align: top'>";
      h += "<div style='color: " + o + "; display: inline-block; border-bottom: 2px dashed gray; margin-bottom: 3px' class='cbold'>" + g + "</div><div></div>";
      h += "<div style='color: " + o + "; display: inline-block; border-bottom: 2px dashed gray; margin-bottom: 3px; color: #AB7951' class='cbold'>" + s.card + "</div>";
      h += "</div>"
    } else {
      h += "<div style='color: " + o + "; display: inline-block; border-bottom: 2px dashed gray; margin-bottom: 3px' class='cbold'>" + g + "</div>"
    }(s.gives || []).forEach(function(q) {
      if (q[0] == "hp") {
        h += bold_prop_line("HP", "+" + q[1], colors.hp)
      }
      if (q[0] == "mp") {
        h += bold_prop_line("MP", "+" + q[1], colors.mp)
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
    if (d.miss) {
      h += bold_prop_line("Miss", d.miss + "%", "#F36C6E")
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
    if (d.output) {
      h += bold_prop_line("Damage Output", "+" + d.output + "%", "#D93319")
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
      h += "<div><span class='clickable' onclick='trade_buy(\"" + b.slot + '","' + b.from_player + '","' + (m.rid || "") + '",$(".tradenum").html())\'>BUY</span></div>'
    }
    if (b.secondhand) {
      c = true;
      h += "<div style='color: gold'>" + to_pretty_num(calculate_item_value(m) * 2 * (m.q || 1)) + " GOLD</div>";
      h += "<div><span class='clickable' onclick='secondhand_buy(\"" + (m.rid || "") + "\")'>BUY</span></div>"
    }
    if (b.lostandfound) {
      c = true;
      h += "<div style='color: gold'>" + to_pretty_num(calculate_item_value(m) * 4 * (m.q || 1)) + " GOLD</div>";
      h += "<div><span class='clickable' onclick='lostandfound_buy(\"" + (m.rid || "") + "\")'>BUY</span></div>"
    }
    if (n) {
      if (s.days) {
        h += "<div style='color: #C3C3C3'>Lasts 30 days</div>"
      }
      if (f) {
        h += "<div style='color: " + colors.cash + "'>" + to_pretty_num(s.cash) + " SHELLS</div>"
      } else {
        h += "<div style='color: gold'>" + to_pretty_num(n) + " GOLD</div>"
      }
      if (f && character && s.cash >= character.cash) {
        h += "<div style='border-top: solid 2px gray; margin-bottom: 2px; margin-top: 3px; margin-left: -1px; margin-right: -1px'></div>";
        h += "<div style='color: #C3C3C3'>You can find SHELLS from gems, monsters. In future, from achievements. For the time being, to receive SHELLS and support our game:</div>";
        h += "<a href='https://adventure.land/shells' class='cancela' target='_blank'><span class='clickable' style='color: #EB8D3F'>BUY or EARN SHELLS</span></a> "
      } else {
        if (s.s) {
          var k = 1;
          if (s.gives) {
            k = 100
          }
          h += "<div style='margin-top: 5px'><!--<input type='number' value='1' class='buynum itemnumi'/> -->";
          h += "<span class='gray'>Q:</span> <div class='inline-block buynum' contenteditable=true data-q='" + k + "'>" + k + "</div> <span class='gray'>|</span> ";
          h += "<span class='clickable' onclick='buy(\"" + t + '",parseInt($(".buynum").html()))\'>BUY</span> ';
          h += "</div>"
        } else {
          h += "<div><span class='clickable' onclick='buy(\"" + t + "\")'>BUY</span></div>"
        }
      }
    }
    if (b.token && b.name && b.name != b.token) {
      var o = "#B6A786";
      if (b.token == "funtoken") {
        o = "#AA6AB3"
      }
      if (G.tokens[b.token][b.name] < 1) {
        h += "<div><span class='clickable' style='color: " + o + "' onclick='exchange_buy(\"" + b.token + '","' + b.name + "\")'>EXCHANGE " + (1 / G.tokens[b.token][b.name]) + " FOR A TOKEN</span></div>"
      } else {
        h += "<div><span class='clickable' style='color: " + o + "' onclick='exchange_buy(\"" + b.token + '","' + b.name + "\")'>EXCHANGE FOR " + G.tokens[b.token][b.name] + " TOKENS</span></div>"
      }
    }
    if (b.sell && m) {
      var n = calculate_item_value(m);
      h += "<div style='color: gold'>" + to_pretty_num(n) + " GOLD</div>";
      if (s.s && m.q) {
        var k = m.q;
        h += "<div style='margin-top: 5px'>";
        h += "<span class='gray'>Q:</span> <div class='inline-block sellnum' contenteditable=true data-q='" + k + "'>" + k + "</div> <span class='gray'>|</span> ";
        h += "<span class='clickable' onclick='sell(\"" + b.num + '",parseInt($(".sellnum").html()))\'>SELL</span> ';
        h += "</div>"
      } else {
        h += "<div><span class='clickable' onclick='sell(\"" + b.num + "\")'>SELL</span></div>"
      }
    }
    if (b.cancel) {
      h += "<div class='clickable' onclick='$(this).parent().remove()'>CLOSE</div>"
    }
    if (in_arr(t, booster_items)) {
      if (m && m.expires) {
        var e = round((-msince(new Date(m.expires))) / (6 * 24)) / 10;
        h += "<div style='color: #C3C3C3'>" + e + " days</div>"
      }
      if (!b.sell) {
        h += "<div class='clickable' onclick=\"btc(event); show_modal($('#boosterguide').html())\" style=\"color: #D86E89\">HOW TO USE</div>"
      }
    }
    if (!n && !b.sell && m && !c && !b.trade && !b.npc) {
      if (s.action) {
        var l = b && b.slot || b && b.num;
        h += '<div><span data-id="' + l + '" class="clickable" style="color: ' + o + '" onclick="' + s.onclick + '"">' + s.action + "</span></div>"
      }
      if (s.type == "computer") {
        h += "<div class='clickable' onclick='add_log(\"Beep. Boop.\")' style=\"color: #32A3B0\">NETWORK</div>"
      }
      if (s.type == "stand") {
        h += "<div class='clickable' onclick='socket.emit(\"trade_history\",{}); $(this).parent().remove()' style=\"color: #44484F\">TRADE HISTORY</div>"
      }
      if (0 && s.type == "computer" && (m.charges === undefined || m.charges) && gameplay == "normal") {
        h += '<div class=\'clickable\' onclick=\'socket.emit("unlock",{name:"code",num:"' + b.num + '"});\' style="color: #BA61A4">UNLOCK</div>'
      }
      if (s.type == "computer") {
        h += "<div class='clickable' onclick='render_computer($(this).parent())' style=\"color: #32A3B0\">NETWORK</div>"
      }
      if (s.type == "stand" && !character.stand) {
        h += "<div class='clickable' onclick='open_merchant(\"" + b.num + '"); $(this).parent().remove()\' style="color: #8E5E2C">OPEN</div>'
      }
      if (s.type == "stand" && character.stand) {
        h += "<div class='clickable' onclick='close_merchant(); $(this).parent().remove()' style=\"color: #8E5E2C\">CLOSE</div>"
      }
      if (s.type == "elixir" && !b.from_player) {
        var j = "DRINK";
        if (s.eat) {
          j = "EAT"
        }
        h += "<div class='clickable' onclick='socket.emit(\"equip\",{num:\"" + b.num + '"}); $(this).parent().remove()\' style="color: #D86E89">' + j + "</div>"
      }
      if (in_arr(m.name, ["stoneofxp", "stoneofgold", "stoneofluck"])) {
        h += "<div class='clickable' onclick='socket.emit(\"convert\",{num:\"" + b.num + '"});\' style="color: ' + colors.cash + '">CONVERT TO SHELLS</div>'
      }
      if (in_arr(m.name, booster_items)) {
        if (m.expires) {
          h += "<div class='clickable' onclick='shift(\"" + b.num + '","' + booster_items[(booster_items.indexOf(m.name) + 1) % 3] + '"); $(this).parent().remove()\' style="color: #438EE2">SHIFT</div>'
        } else {
          h += "<div class='clickable' onclick='activate(\"" + b.num + '","activate"); $(this).parent().remove()\' style="color: #438EE2">ACTIVATE</div>'
        }
      }
    }
    if (b.craft) {
      var r = 0;
      h += "<div style='margin-top: 5px'></div>";
      h += "<div style='color: " + o + "; display: inline-block; border-bottom: 2px dashed gray; margin-bottom: 3px' class='cbold'>Recipe</div>";
      h += "<div></div>";
      G.craft[t].items.forEach(function(u) {
        var v = undefined;
        if (u[0] != 1) {
          v = u[0]
        }
        h += item_container({
          skin: G.items[u[1]].skin
        }, {
          name: u[1],
          q: v,
          level: u[2]
        });
        r += 1;
        if (!(r % 4)) {
          h += "<div></div>"
        }
      });
      h += bold_prop_line("Cost", to_pretty_num(G.craft[t].cost), "gold")
    }
    if (b.dismantle) {
      var r = 0;
      h += "<div style='margin-top: 5px'></div>";
      h += "<div style='color: " + o + "; display: inline-block; border-bottom: 2px dashed gray; margin-bottom: 3px' class='cbold'>Dismantles-to</div>";
      h += "<div></div>";
      G.dismantle[t].items.forEach(function(u) {
        var v = undefined;
        if (u[0] != 1) {
          v = u[0]
        }
        h += item_container({
          skin: G.items[u[1]].skin
        }, {
          name: u[1],
          q: v
        });
        r += 1;
        if (!(r % 4)) {
          h += "<div></div>"
        }
      });
      h += bold_prop_line("Cost", to_pretty_num(G.dismantle[t].cost), "gold")
    }
    if (b.from) {
      h += bold_prop_line("From", b.from, "#BED4DE")
    }
  }
  h += "</div>";
  if (p == "html") {
    return h
  } else {
    $(p).html(h)
  }
}
function render_condition(a, b) {
  var d = G.conditions[b],
    c = 0,
    e = undefined;
  if (ctarget && ctarget.s[b] && ctarget.s[b].ms) {
    c = parseInt(ctarget.s[b].ms / 6000) / 10
  }
  if (ctarget && ctarget.s[b] && ctarget.s[b].f) {
    e = ctarget.s[b].f
  }
  render_item(a, {
    skin: d.skin,
    item: d,
    minutes: c,
    from: e
  })
}
function render_item_selector(a, c) {
  if (c && !c.purpose) {
    purpose = "buying"
  }
  var b = [],
    g = 0,
    e = "<div style='border: 5px solid gray; height: 400px; overflow: scroll; background: black'>";
  for (var h in G.items) {
    if (!G.items[h].ignore) {
      b.push(G.items[h])
    }
  }
  b.sort(function(k, j) {
    return j.g - k.g
  });
  for (var d = 0; d < b.length; d++) {
    var f = b[d];
    e += item_container({
      skin: f.skin,
      def: f,
      onclick: "gallery_click('" + f.id + "')"
    });
    g++;
    if (!(g % 5)) {
      e += "<br />"
    }
  }
  e += "</div>";
  $(a).html(e)
}
function allow_drop(a) {
  a.preventDefault()
}
function on_drag_start(a) {
  last_drag_start = new Date();
  a.dataTransfer.setData("text", a.target.id)
}
function on_rclick(g) {
  var b = $(g),
    a = b.data("inum"),
    f = b.data("snum"),
    c = b.data("sname"),
    h = b.data("onrclick");
  if (h) {
    smart_eval(h)
  } else {
    if (c !== undefined) {
      socket.emit("unequip", {
        slot: c
      })
    } else {
      if (f !== undefined) {
        socket.emit("bank", {
          operation: "swap",
          inv: -1,
          str: f,
          pack: last_rendered_items
        })
      } else {
        if (a !== undefined) {
          if (topleft_npc == "items") {
            socket.emit("bank", {
              operation: "swap",
              inv: a,
              str: -1,
              pack: last_rendered_items
            })
          } else {
            if (topleft_npc == "merchant") {
              var j = character.items[parseInt(a)];
              if (!j) {
                return
              }
              render_item("#merchant-item", {
                item: G.items[j.name],
                name: j.name,
                actual: j,
                sell: 1,
                num: parseInt(a)
              })
            } else {
              if (topleft_npc == "exchange") {
                var g = character.items[a],
                  d = null;
                if (g) {
                  d = G.items[g.name]
                }
                if (!d) {
                  return
                }
                if (d.quest && exchange_type != d.quest) {
                  return
                }
                if (d.e) {
                  if (e_item !== null) {
                    return
                  }
                  e_item = a;
                  var e = $("#citem" + a).all_html();
                  $("#citem" + a).parent().html("");
                  $("#eitem").html(e)
                }
              } else {
                if (topleft_npc == "none") {
                  var g = character.items[a],
                    d = null;
                  if (g) {
                    d = G.items[g.name]
                  }
                  if (!d) {
                    return
                  }
                  if (p_item !== null) {
                    return
                  }
                  p_item = a;
                  var e = $("#citem" + a).all_html();
                  $("#citem" + a).parent().html("");
                  $("#pitem").html(e)
                } else {
                  if (topleft_npc == "upgrade") {
                    var g = character.items[a],
                      d = null;
                    if (g) {
                      d = G.items[g.name]
                    }
                    if (!d) {
                      return
                    }
                    if (d.upgrade) {
                      if (u_item !== null) {
                        return
                      }
                      u_item = a;
                      var e = $("#citem" + a).all_html();
                      $("#citem" + a).parent().html("");
                      $("#uweapon").html(e)
                    }
                    if (d.type == "uscroll" || d.type == "pscroll") {
                      if (u_scroll !== null) {
                        return
                      }
                      u_scroll = a;
                      var e = $("#citem" + a).all_html();
                      if ((character.items[a].q || 1) < 2) {
                        $("#citem" + a).parent().html("")
                      }
                      $("#uscroll").html(e)
                    }
                    if (d.type == "offering") {
                      if (u_offering !== null) {
                        return
                      }
                      u_offering = a;
                      var e = $("#citem" + a).all_html();
                      if ((character.items[a].q || 1) < 2) {
                        $("#citem" + a).parent().html("")
                      }
                      $("#uoffering").html(e)
                    }
                  } else {
                    if (topleft_npc == "compound") {
                      var g = character.items[a],
                        d = null;
                      if (g) {
                        d = G.items[g.name]
                      }
                      if (!d) {
                        return
                      }
                      if (d.compound && c_last < 3) {
                        c_items[c_last] = a;
                        var e = $("#citem" + a).all_html();
                        $("#citem" + a).parent().html("");
                        $("#compound" + c_last).html(e);
                        c_last++
                      }
                      if (d.type == "cscroll") {
                        if (c_scroll !== null) {
                          return
                        }
                        c_scroll = a;
                        var e = $("#citem" + a).all_html();
                        if ((character.items[a].q || 1) < 2) {
                          $("#citem" + a).parent().html("")
                        }
                        $("#cscroll").html(e)
                      }
                      if (d.type == "offering") {
                        if (c_offering !== null) {
                          return
                        }
                        c_offering = a;
                        var e = $("#citem" + a).all_html();
                        if ((character.items[a].q || 1) < 2) {
                          $("#citem" + a).parent().html("")
                        }
                        $("#coffering").html(e)
                      }
                    } else {
                      if (topleft_npc == "craftsman") {
                        var g = character.items[a],
                          d = null;
                        if (g) {
                          d = G.items[g.name]
                        }
                        if (!d) {
                          return
                        }
                        if (cr_last < 9) {
                          cr_items[cr_last] = a;
                          var e = $("#citem" + a).all_html();
                          $("#citem" + a).parent().html("");
                          $("#critem" + cr_last).html(e);
                          cr_last++
                        }
                      } else {
                        if (topleft_npc == "dismantler") {
                          if (ds_item !== null) {
                            return
                          }
                          ds_item = a;
                          var e = $("#citem" + a).all_html();
                          if ((character.items[a].q || 1) < 2) {
                            $("#citem" + a).parent().html("")
                          }
                          $("#dsitem").html(e)
                        } else {
                          a = parseInt(a, 10);
                          if (character && character.items[a] && G.items[character.items[a].name].type == "elixir") {
                            return
                          }
                          socket.emit("equip", {
                            num: a
                          })
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
function on_drop(n) {
  n.preventDefault();
  var t = n.dataTransfer.getData("text"),
    k = false,
    m = false;
  var c = $(document.getElementById(t)),
    s = $(n.target);
  while (s && s.parent() && s.attr("ondrop") == undefined) {
    s = s.parent()
  }
  var b = s.data("cnum"),
    f = s.data("slot"),
    a = s.data("strnum"),
    p = s.data("trigrc"),
    q = s.data("skid");
  var u = c.data("inum"),
    r = c.data("sname"),
    j = c.data("snum"),
    d = c.data("skname");
  console.log(b + " " + u + " " + f + " " + r + " skid: " + q + " skname: " + d);
  if (u !== undefined && q !== undefined) {
    u = parseInt(u);
    if ((u || u === 0) && character.items[u]) {
      keymap[q] = {
        type: "item",
        name: character.items[u].name
      };
      set_setting(real_id, "keymap", keymap);
      render_skills();
      render_skills()
    }
  } else {
    if (d !== undefined && q !== undefined) {
      if (d == "eval") {
        keymap[q] = {
          name: "eval",
          code: "add_log('Empty eval','gray')"
        }
      } else {
        if (d == "snippet") {
          keymap[q] = {
            name: "snippet",
            code: "game_log('Empty snippet','gray')"
          }
        } else {
          keymap[q] = d
        }
      }
      set_setting(real_id, "keymap", keymap);
      render_skills();
      render_skills()
    } else {
      if (p != undefined && u != undefined) {
        on_rclick(c.get(0))
      } else {
        if (j != undefined && a != undefined) {
          socket.emit("bank", {
            operation: "move",
            a: j,
            b: a,
            pack: last_rendered_items
          });
          k = true
        } else {
          if (a != undefined && u != undefined) {
            socket.emit("bank", {
              operation: "swap",
              inv: u,
              str: a,
              pack: last_rendered_items
            });
            m = true
          } else {
            if (b != undefined && j != undefined) {
              socket.emit("bank", {
                operation: "swap",
                inv: b,
                str: j,
                pack: last_rendered_items
              });
              m = true
            } else {
              if (b !== undefined && b == u) {
                if (is_mobile && mssince(last_drag_start) < 300) {
                  inventory_click(parseInt(u))
                }
              } else {
                if (b != undefined && u != undefined) {
                  socket.emit("imove", {
                    a: b,
                    b: u
                  });
                  k = true
                } else {
                  if (r !== undefined && r == f) {
                    if (is_mobile && mssince(last_drag_start) < 300) {
                      slot_click(f)
                    }
                  } else {
                    if (b != undefined && r != undefined) {
                      socket.emit("unequip", {
                        slot: r,
                        position: b
                      })
                    } else {
                      if (f != undefined && u != undefined) {
                        if (in_arr(f, trade_slots)) {
                          if (character.slots[f]) {
                            return
                          }
                          try {
                            var l = character.items[parseInt(u)];
                            render_item("#topleftcornerdialog", {
                              trade: 1,
                              item: G.items[l.name],
                              actual: l,
                              num: parseInt(u),
                              slot: f
                            });
                            $(".editable").focus();
                            dialogs_target = ctarget
                          } catch (o) {
                            console.log("TRADE-ERROR: " + o)
                          }
                        } else {
                          socket.emit("equip", {
                            num: u,
                            slot: f
                          }), m = true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if (k) {
    var h = c.all_html(),
      g = s.html();
    s.html("");
    c.parent().html(g);
    s.html(h)
  }
  if (m) {
    s.html(c.all_html())
  }
}
function item_container(A, r) {
  var k = "",
    g = "",
    z = 3,
    m = "",
    f = "",
    s = "",
    b = "",
    t = A.bcolor || "gray",
    l = "#C5C5C5",
    B = "",
    q = A.size || 40,
    n = null,
    e = false;
  if (r && r.name) {
    n = G.items[r.name]
  }
  if (r && n) {
    if ((n.upgrade && r.level > 8 || n.compound && r.level > 4)) {
      t = l
    }
    if (calculate_item_grade(r) == 2 || calculate_item_value(r) > 5000000) {
      t = l;
      e = true
    }
  }
  if (n && r && n.type == "booster" && r.level) {
    t = l
  }
  if (A.draggable || !("draggable" in A)) {
    m += " draggable='true' ondragstart='on_drag_start(event)'";
    f += "ondrop='on_drop(event)' ondragover='allow_drop(event)'"
  }
  if (A.droppable) {
    A.trigrc = true;
    f += "ondrop='on_drop(event)' ondragover='allow_drop(event)'"
  }
  if (A.onclick) {
    f += ' onclick="' + A.onclick + '" class="clickable" '
  }
  if (A.cnum != undefined) {
    b = "data-cnum='" + A.cnum + "' "
  }
  if (A.trigrc != undefined) {
    b = "data-trigrc='1'"
  }
  if (A.strnum != undefined) {
    b = "data-strnum='" + A.strnum + "' "
  }
  if (A.slot != undefined) {
    b = "data-slot='" + A.slot + "' "
  }
  if (A.skid != undefined) {
    b = "data-skid='" + A.skid + "' "
  }
  if (A.cid) {
    f += " id='" + A.cid + "' "
  }
  k += "<div " + b + "style='position: relative; display:inline-block; margin: 2px; border: 2px solid " + t + "; height: " + (q + 2 * z) + "px; width: " + (q + 2 * z) + "px; background: black; vertical-align: top' " + f + ">";
  if (A.skid && !A.skin) {
    k += "<div class='truui' style='border-color: gray; color: white'>" + A.skid + "</div>"
  }
  if (A.shade) {
    var u = G.itemsets[G.positions[A.shade][0] || "pack_1a"],
      c = q / u.size;
    var p = G.positions[A.shade][1],
      o = G.positions[A.shade][2];
    k += "<div style='position: absolute; top: -2px; left: -2px; padding:" + (z + 2) + "px'>";
    k += "<div style='overflow: hidden; height: " + (q) + "px; width: " + (q) + "px;'>";
    k += "<img style='width: " + (u.columns * u.size * c) + "px; height: " + (u.rows * u.size * c) + "px; margin-top: -" + (o * q) + "px; margin-left: -" + (p * q) + "px; opacity: " + (A.s_op || 0.36) + ";' src='" + u.file + "' draggable='false' />";
    k += "</div>";
    k += "</div>"
  }
  if (A.skin) {
    if (!G.positions[A.skin]) {
      A.skin = "placeholder"
    }
    var w = G.itemsets[G.positions[A.skin][0] || "pack_1a"],
      j = G.positions[A.skin][1],
      h = G.positions[A.skin][2];
    var D = q / w.size;
    if (r && r.level && r.level > 7) {
      B += " glow" + min(A.level, 10)
    }
    if (A.num != undefined) {
      s = "class='rclick" + B + "' data-inum='" + A.num + "'"
    }
    if (A.snum != undefined) {
      s = "class='rclick" + B + "' data-snum='" + A.snum + "'"
    }
    if (A.sname != undefined) {
      s = "class='rclick" + B + "' data-sname='" + A.sname + "'"
    }
    if (A.skname != undefined) {
      s = "class='rclick" + B + "' data-skname='" + A.skname + "'"
    }
    if (A.on_rclick) {
      s = "class='rclick" + B + "' data-onrclick=\"" + A.on_rclick + '"'
    }
    k += "<div " + s + " style='background: black; position: absolute; bottom: -2px; left: -2px; border: 2px solid " + t + ";";
    k += "padding:" + (z) + "px; overflow: hidden' " + ("id='" + (A.id || ("rid" + randomStr(12))) + "'") + " " + m + ">";
    k += "<div style='overflow: hidden; height: " + (q) + "px; width: " + (q) + "px;'>";
    k += "<img style='width: " + (w.columns * w.size * D) + "px; height: " + (w.rows * w.size * D) + "px; margin-top: -" + (h * q) + "px; margin-left: -" + (j * q) + "px;' src='" + w.file + "' draggable='false' />";
    k += "</div>";
    if (r) {
      var v = "u";
      if (n && n.compound) {
        v = "c"
      }
      if (r.q && r.left) {
        k += "<div class='iuui' style='color: white'>" + r.q + "</div>"
      } else {
        if (r.q && r.q != 1) {
          if (n && n.gives && n.gives[0] && n.gives[0][0] == "hp") {
            k += "<div class='iqui iqhp'>" + r.q + "</div>"
          } else {
            if (n && n.gives && n.gives[0] && n.gives[0][0] == "mp") {
              k += "<div class='iqui iqmp'>" + r.q + "</div>"
            } else {
              k += "<div class='iqui'>" + r.q + "</div>"
            }
          }
        }
      }
      if (r.level) {
        var a = r.level,
          d = a;
        if (n.type == "booster") {
          d = a = (r.level == 1 && "A" || r.level == 2 && "B" || r.level == 3 && "C" || r.level == 4 && "D" || r.level == 5 && "E" || r.level > 5 && "W")
        }
        if (e && n.compound && d == 3) {
          d = 4
        }
        if (e && n.upgrade && d == 7) {
          d = 8
        }
        k += "<div class='iuui " + v + "level" + min(d, n.compound && 5 || 12) + "' style='border-color: " + t + "'>" + (a == 10 && "X" || a == 11 && "Y" || a == 12 && "Z" || a == 5 && v == "c" && "V" || a) + "</div>"
      }
      if (r.s) {
        k += "<div class='iqui'>" + r.s + "</div>"
      }
    }
    if (A.slot && in_arr(A.slot, trade_slots)) {
      k += "<div class='truui' style='border-color: " + t + ";'>$</div>"
    }
    if (r && r.v) {
      k += "<div class='trruui ivu' style='border-color: " + t + "; line-height: 7px'><br />^</div>"
    } else {
      if (r && r.m) {
        k += "<div class='trruui imu' style='border-color: " + t + ";'>M</div>"
      }
    }
    if (A.skid) {
      k += "<div class='skidloader" + A.skid + "' style='position: absolute; bottom: 0px; right: 0px; width: 4px; height: 0px; background-color: yellow'></div>";
      k += "<div class='truui' style='border-color: gray; color: white'>" + A.skid + "</div>"
    }
    k += "</div>"
  }
  k += "</div>";
  return k
}
function render_skillbar(c) {
  if (c) {
    $("#skillbar").html("").hide();
    return
  }
  var b = "<div style='background-color: black; border: 5px solid gray; padding: 2px; display: inline-block' class='enableclicks'>",
    a = 0;
  skillbar.forEach(function(f) {
    var e = keymap[f],
      d = e;
    if (e) {
      if (e && e.skin) {
        d = e.skin
      } else {
        if (e.type == "item" && G.items[e.name]) {
          d = G.items[e.name].skin
        } else {
          if (G.skills[e.name || e]) {
            d = G.skills[e.name || e].skin
          }
        }
      }
      b += item_container({
        skid: f,
        skin: d || "",
        draggable: false,
        droppable: true,
        onclick: "on_skill('" + f + "')"
      }, e)
    } else {
      b += item_container({
        skid: f,
        draggable: false,
        droppable: true
      })
    }
    if (!(skillbar.length >= 8 && !(skillbar.length % 2) && !(a % 2))) {
      b += "<div></div>"
    }
    a++
  });
  b += "</div>";
  $("#skillbar").html(b).css("display", "inline-block");
  restart_skill_tints()
}
function skill_click(a) {
  if (skillsui && keymap[a]) {
    render_skill("#skills-item", keymap[a].name || keymap[a], keymap[a])
  }
  if (G.skills[a]) {
    render_skill("#skills-item", a)
  }
}
var skills_page = "I";

function render_skills() {
  var l = 0,
    d = "text-align: right";
  if (skillsui) {
    $("#theskills").remove();
    skillsui = false;
    render_skillbar();
    return
  }
  var h = "<div id='skills-item' style='display: inline-block; vertical-align: top; margin-right: 5px'></div>";
  h += "<div style='background-color: black; border: 5px solid gray; padding: 2px; font-size: 24px; display: inline-block'>";
  h += "<div class='textbutton' style='margin-left: 5px'><span  onclick='btc(event); show_snippet()'>MAPPING</span> <span style='color: " + (skills_page == "I" && "#76BDE5" || "#7C7C7C") + ";' class='clickable' onclick='btc(event); skills_page=\"I\"; render_skills(); render_skills();'>1</span> <span style='color: " + (skills_page == "II" && "#E38241" || "#7C7C7C") + ";' class='clickable' onclick='btc(event); skills_page=\"II\"; render_skills(); render_skills();'>2</span> <span style='color: " + (skills_page == "U" && "#8FCE72" || "#7C7C7C") + ";' class='clickable' onclick='btc(event); skills_page=\"U\"; render_skills(); render_skills();'>U</span> <span style='float:right; color: #7C7C7C; margin-right: 5px' class='clickable' onclick='btc(event); show_json(keymap)'><span style='color:#DECE31'>&gt;</span> DATA <span style='color:#DECE31'>&lt;</span></span></div>";
  var c = ["1", "2", "3", "4", "5", "6", "7"],
    b = ["Q", "W", "E", "R", "X", "T", "B"];
  if (skills_page == "II") {
    c = ["8", "9", "0", "G", "H", "J", "K"], b = ["SHIFT", "Z", "V", "M", "P", "D", "BACK"]
  }
  if (skills_page == "U") {
    c = ["ESC", "A", "C", "F", "I", "TAB", "ENTER"], b = ["UP", "LEFT", "DOWN", "RIGHT", ",", "S", "U"]
  }
  h += "<div>";
  c.forEach(function(o) {
    var j = keymap[o],
      a = j;
    if (j && j.skin) {
      a = j.skin
    } else {
      if (j && j.type == "item" && G.items[j.name]) {
        a = G.items[j.name].skin
      } else {
        if (j && G.skills[j.name || j]) {
          a = G.skills[j.name || j].skin
        }
      }
    }
    h += item_container({
      skid: o,
      skin: a || "",
      onclick: "on_skill('" + o + "')"
    }, j)
  });
  h += "</div>";
  h += "<div>";
  b.forEach(function(o) {
    var j = keymap[o],
      a = j;
    if (j && j.skin) {
      a = j.skin
    } else {
      if (j && j.type == "item" && G.items[j.name]) {
        a = G.items[j.name].skin
      } else {
        if (j && G.skills[j.name || j]) {
          a = G.skills[j.name || j].skin
        }
      }
    }
    h += item_container({
      skid: o,
      skin: a || "",
      onclick: "on_skill('" + o + "')"
    }, j)
  });
  h += "</div>";
  h += "<div class='textbutton' style='margin-left: 5px'><span class='clickable' onclick='btc(event); show_json(G.skills)'>SKILLS</span> <span style='float:right; color: #7C7C7C; margin-right: 5px' class='clickable' onclick='btc(event); show_modal($(\"#keymapguide\").html())'><span style='color:#60B8C7'>&gt;</span> CONFIG <span style='color:#60B8C7'>&lt;</span></span></div>";
  var n = [],
    m = 0,
    k = [],
    g = 0;
  object_sort(G.skills).forEach(function(o) {
    var j = o[0],
      a = o[1];
    if (a.type == "skill" && (!a["class"] || in_arr(character.ctype, a["class"]) || character.role == "gm")) {
      n.push({
        name: j
      })
    }
    if (a.type == "passive" && (!a["class"] || in_arr(character.ctype, a["class"]) || character.role == "gm")) {
      n.push({
        name: j
      })
    }
    if (a.type == "ability" && (!a["class"] || in_arr(character.ctype, a["class"]) || character.role == "gm")) {
      k.push({
        name: j
      })
    }
    if (a.type == "utility" && a.ui !== false && (!a["class"] || in_arr(character.ctype, a["class"]))) {
      k.push({
        name: j
      })
    }
  });
  if (character.role == "gm") {
    k.push({
      name: "gm"
    })
  }
  for (var f = 0; f < 10; f++) {
    h += "<div>";
    for (var e = 0; e < 7; e++) {
      if (m < n.length) {
        h += item_container({
          skin: G.skills[n[m].name].skin,
          onclick: "skill_click('" + n[m].name + "')",
          skname: n[m].name
        }, n[m])
      } else {
        h += item_container({})
      }
      m++
    }
    h += "</div>";
    if (m >= n.length) {
      break
    }
  }
  h += "<div class='textbutton' style='margin-left: 5px' onclick='btc(event); show_json(G.skills)'>ABILITIES</div>";
  for (var f = 0; f < 10; f++) {
    h += "<div>";
    for (var e = 0; e < 7; e++) {
      if (g < k.length) {
        h += item_container({
          skin: G.skills[k[g].name].skin,
          onclick: "skill_click('" + k[g].name + "')",
          skname: k[g].name
        }, k[g])
      } else {
        h += item_container({})
      }
      g++
    }
    h += "</div>";
    if (g >= k.length) {
      break
    }
  }
  h += "</div>";
  skillsui = true;
  render_skillbar(1);
  $("body").append("<div id='theskills' style='position: fixed; z-index: 310; bottom: 0px; right: 0px'></div>");
  $("#theskills").html(h);
  restart_skill_tints()
}
function render_teleporter() {
  var a = "<div style='max-width: 420px; text-align: center'>";
  for (var b in G.maps) {
    if (!G.maps[b].ignore && !G.maps[b].instance) {
      a += "<div class='gamebutton' style='margin-left: 5px; margin-bottom: 5px' onclick='socket.emit(\"transport\",{to:\"" + b + "\"})'>" + G.maps[b].name + "</div>"
    }
  }
  a += "</div>";
  show_modal(a, {
    wrap: false
  })
}
function render_travel(b) {
  var a = "<div style='max-width: 420px; text-align: center'>",
    c = "code_travel";
  if (b) {
    c = "render_spawns"
  }
  object_sort(G.maps).forEach(function(e) {
    var d = e[0];
    if (!G.maps[d].ignore && !G.maps[d].instance && (!G.maps[d].irregular || b)) {
      a += "<div class='gamebutton' style='margin-left: 5px; margin-bottom: 5px' onclick='hide_modal(); " + c + '("' + d + "\");'>" + G.maps[d].name + "</div>"
    }
  });
  a += "</div>";
  show_modal(a, {
    wrap: false
  })
}
function render_spawns(c) {
  var b = "<div style='max-width: 420px; text-align: center'>",
    a = 0;
  G.maps[c].spawns.forEach(function(d) {
    b += "<div class='gamebutton' style='margin-left: 5px; margin-bottom: 5px' onclick='direct_travel(\"" + c + '","' + a + "\"); hide_modal()'>" + c + "[" + a + "]</div>";
    a++
  });
  b += "</div>";
  show_modal(b, {
    wrap: false
  })
}
function render_interaction(h, f) {
  if (f != "return_html") {
    topleft_npc = "interaction";
    rendered_target = topleft_npc;
    rendered_interaction = h
  }
  var b = 0,
    j = 0,
    d = "/images/tiles/characters/npc1.png",
    c = "normal";
  var g = "<div style='background-color: #E5E5E5; color: #010805; border: 5px solid gray; padding: 6px 12px 6px 12px; font-size: 30px; display: inline-block; max-width: 420px'>";
  if (h.auto) {
    d = FC[h.skin];
    b = FM[h.skin][1];
    j = FM[h.skin][0]
  } else {
    if (in_arr(h, ["wizard", "hardcoretp"])) {
      b = 2;
      j = 0;
      d = "/images/tiles/characters/chara8.png"
    } else {
      if (in_arr(h, ["santa", "candycane_success"])) {
        b = 0;
        j = 0;
        d = "/images/tiles/characters/animationc.png";
        c = "animation"
      } else {
        if (in_arr(h, ["leathers", "leather_success"])) {
          b = 1;
          j = 0;
          d = "/images/tiles/characters/npc5.png"
        } else {
          if (in_arr(h, ["lostearring", "lostearring_success"])) {
            b = 3;
            j = 0;
            d = "/images/tiles/characters/chara8.png"
          } else {
            if (in_arr(h, ["mistletoe", "mistletoe_success"])) {
              b = 0;
              j = 0;
              d = "/images/tiles/characters/chara8.png"
            } else {
              if (in_arr(h, ["crafting"])) {
                b = 0;
                j = 0;
                d = "/images/tiles/characters/npc5.png"
              } else {
                if (in_arr(h, ["ornaments", "ornament_success"])) {
                  b = 1;
                  j = 0;
                  d = "/images/tiles/characters/chara8.png"
                } else {
                  if (in_arr(h, ["jailer", "guard", "blocker", "test"])) {
                    b = 3;
                    j = 0;
                    d = "/images/tiles/characters/chara5.png"
                  } else {
                    if (in_arr(h, ["seashells", "seashell_success"])) {
                      b = 0;
                      j = 1;
                      d = "/images/tiles/characters/npc1.png"
                    } else {
                      if (in_arr(h, ["lottery"])) {
                        b = 3;
                        j = 0;
                        d = "/images/tiles/characters/npc6.png"
                      } else {
                        if (in_arr(h, ["newupgrade"])) {
                          b = 3;
                          j = 1;
                          d = "/images/tiles/characters/chara8.png"
                        } else {
                          if (h == "tavern") {
                            b = 0;
                            j = 1;
                            d = "/images/tiles/characters/custom1.png"
                          } else {
                            if (h == "standmerchant") {
                              b = 3;
                              j = 0;
                              d = "/images/tiles/characters/npc5.png"
                            } else {
                              if (h == "subscribe") {
                                b = 3;
                                j = 1;
                                d = "/images/tiles/characters/chara7.png"
                              } else {
                                if (in_arr(h, ["gemfragments", "gemfragment_success"])) {
                                  b = 2;
                                  j = 1;
                                  d = "/images/tiles/characters/npc1.png"
                                } else {
                                  if (in_arr(h, ["buyshells", "noshells", "yesshells"])) {
                                    b = 0;
                                    j = 1;
                                    d = "/images/tiles/characters/dwarf2.png"
                                  } else {
                                    if (in_arr(h, ["unlock_items2", "unlock_items3", "unlock_items4", "unlock_items5", "unlock_items6", "unlock_items7"])) {
                                      b = 3;
                                      j = 1;
                                      d = "/images/tiles/characters/npc4.png";
                                      if (h == "unlock_items2") {
                                        j = 1, b = 0
                                      }
                                      if (h == "unlock_items3") {
                                        j = 1, b = 0
                                      }
                                      if (h == "unlock_items4") {
                                        j = 1, b = 2
                                      }
                                      if (h == "unlock_items5") {
                                        j = 1, b = 2
                                      }
                                      if (h == "unlock_items6") {
                                        j = 0, b = 1
                                      }
                                      if (h == "unlock_items7") {
                                        j = 0, b = 1
                                      }
                                    } else {
                                      return
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if (c == "normal") {
    g += "<div style='float: left; margin-top: -20px; width: 104px; height: 92px; overflow: hidden'><img style='margin-left: -" + (104 * (b * 3 + 1)) + "px; margin-top: -" + (144 * (j * 4)) + "px; width: 1248px; height: 1152px;' src='" + d + "'/></div>"
  } else {
    g += "<div style='float: left; margin-top: -20px; width: 104px; height: 98px; overflow: hidden'><img style='margin-left: -" + (188 * b + 40) + "px; margin-top: -" + (200 * j + 50) + "px; width: 2256px; height: 1600px;' src='" + d + "'/></div>"
  }
  if (h.auto) {
    g += h.message;
    if (h.button) {
      interaction_onclick = h.onclick, g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='interaction_onclick()'>" + h.button + "</div></span>"
    }
  } else {
    if (h == "seashells") {
      g += "Ah, I love the sea, so calming. As a kid, I loved spending time on the beach. Collecting seashells. If you happen to find some, I would love to add them to my collection.";
      g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_exchange_shrine(\"seashell\")'>I HAVE 20!</div></span>"
    } else {
      if (h == "buyshells") {
        g += "Yo dawg, I can hook you up with some shells If you want. I get these directly from Wizard in bulk so they are legit.";
        g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_shells_buyer()'>HMM, SURE...</div></span>"
      } else {
        if (h == "noshells") {
          g += "Ugh, maybe go farm more gold. It's not like they grow on trees. Just kill some puny monsters, you'll have plenty!"
        } else {
          if (h == "yesshells") {
            g += "Please doing business with you! You'll have your shells in a couple of milliseconds!"
          } else {
            if (h == "hardcoretp") {
              g += "Aww, are you stuck here? I can take you places. If you want!";
              g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_teleporter()'>TELEPORT</div></span>"
            } else {
              if (h == "seashell_success") {
                if (Math.random() < 0.001) {
                  g += "Awww. Ty. Ty. Ty. Xoxo."
                } else {
                  g += "How kind of you! Please accept this small gift in return."
                }
                d_text("+1", get_npc("fisherman"), {
                  color: "#DFE9D9"
                })
              } else {
                if (h == "subscribe") {
                  g += "It's that time of the day! Are you in?!";
                  g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='socket.emit(\"signup\")'>SIGN ME UP!</div></span>"
                } else {
                  if (h == "tavern") {
                    g += "Tavern. A place for adventurers to relax, drink, unwind, play games, wager, challenge each other in friendly games. Currently under construction."
                  } else {
                    if (h == "test") {
                      g += "Greetings! Looking for a good deal on weapons and armor? Then you came to the right place! No one sells better gear than me!"
                    } else {
                      if (h == "newupgrade") {
                        g += "Adventurer! I can upgrade your weapons or armors. Combine 3 accessories to make a stronger one! Tho, beware, the process isn't perfect. Sometimes the items are ... lost.";
                        g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_upgrade_shrine()'>UPGRADE</div> <div class='slimbutton' onclick='render_compound_shrine()'>COMBINE</div></span>"
                      } else {
                        if (h == "crafting") {
                          g += "I can craft or dismantle items for you. Price differs from item to item. Check out my recipes if you are interested!";
                          g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_recipes()'>RECIPES</div> <div class='slimbutton' onclick='render_craftsman()'>CRAFT</div> <div class='slimbutton' onclick='render_dismantler()'>DISMANTLE</div></span>"
                        } else {
                          if (h == "wizard") {
                            g += "Well, Hello there! I'm Wizard, I made this game. Hope you enjoy it. If you have any issues, suggestions, feel free to email me at hello@adventure.land!"
                          } else {
                            if (h == "santa") {
                              g += "Happy holidays! Please excuse my companion, he is a bit grumpy. If you happen to find any candy canes, that might cheer him up!";
                              g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_exchange_shrine(\"candycane\")'>I HAVE ONE!</div></span>"
                            } else {
                              if (h == "standmerchant") {
                                g += "Anyone can become a merchant and start trading. You only need a merchant stand to display your items on!";
                                g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_merchant(get_npc(\"standmerchant\"))'>LET ME BUY ONE!</div></span>"
                              } else {
                                if (h == "candycane_success") {
                                  g += "Ah! Thanks for cheering him up. Here's something for you in return!"
                                } else {
                                  if (h == "lostearring") {
                                    g += "Ewww. Ewww. Ewww. These wretched things ate my earrings. Kill them, kill them all. Bring my earrings back!";
                                    g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_exchange_shrine(\"lostearring\")'>AS YOU WISH</div></span>"
                                  } else {
                                    if (h == "lostearring_success") {
                                      g += "You did well. Here's something left from one of my old husbands..."
                                    } else {
                                      if (h == "mistletoe") {
                                        g += "You know, It gets boring in here sometimes ... I'm looking for some excitement. Uhm, Do you have a Mistletoe?";
                                        g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_exchange_shrine(\"mistletoe\")'>OH MY, I DO!</div></span>"
                                      } else {
                                        if (h == "mistletoe_success") {
                                          g += "Haha! You thought I was going to give you a kiss?! You wish... Take this instead!"
                                        } else {
                                          if (h == "ornaments") {
                                            g += "Hmm. We should decorate these trees. I need some Ornaments tho. If you happen to collect " + G.items.ornament.e + " of them, let me know!";
                                            g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_exchange_shrine(\"ornament\")'>YOU GOT IT!</div></span>"
                                          } else {
                                            if (h == "ornament_success") {
                                              g += "Thank you! Here's something in return."
                                            } else {
                                              if (h == "gemfragment_success") {
                                                g += "Bwahahahahah *cough* Ehem.. Thanks! You got a good deal. Keep bringing these fragments to me, don't give them to anyone else.";
                                                d_text("+1", get_npc("gemmerchant"), {
                                                  color: "#E78295"
                                                })
                                              } else {
                                                if (h == "gemfragments") {
                                                  g += "Back in the day we had miners, then came the moles, they work for free yet retrieving the gems is a challenge. Bring me " + G.items.gemfragment.e + " gem fragments and I can give you something exciting in return, no questions asked.";
                                                  g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_exchange_shrine(\"gemfragment\")'>I GOT " + G.items.gemfragment.e + "!</div></span>"
                                                } else {
                                                  if (h == "leathers") {
                                                    g += "Hey, hey, hey! What brings you to this cold land? I personally love it here, ideal for my work. If you can bring me " + G.items.leather.e + " Leathers, I can give you one of my products in return.";
                                                    g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_exchange_shrine(\"leather\")'>I HAVE " + G.items.leather.e + "!</div></span>"
                                                  } else {
                                                    if (h == "leather_success") {
                                                      g += "Here you go! Enjoy! Keep bringing leathers to me, I have a lot to offer!";
                                                      d_text("+1", get_npc("leathermerchant"), {
                                                        color: "#DFE9D9"
                                                      })
                                                    } else {
                                                      if (h == "jailer") {
                                                        g += "Tu-tu-tu. Have you been a bad " + (Math.random() < 0.5 && "boy" || "girl") + "? No worries. The lawmakers must see the potential in you, so instead of getting rid of you, they sent you here. You are free to leave whenever you want. But please don't repeat your mistake.";
                                                        g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='socket.emit(\"leave\")'>LEAVE</div></span>"
                                                      } else {
                                                        if (h == "blocker" || h == "guard") {
                                                          var a = Math.random();
                                                          if (a < 0.5) {
                                                            g += "Hmm. hmm. hmm. Can't let you pass. Check again later tho!"
                                                          } else {
                                                            g += "There's some work going on inside. Maybe check back later!"
                                                          }
                                                        } else {
                                                          if (h == "lottery") {
                                                            g += "Hi Dear! The lottery tickets for this week haven't arrived yet. Apologies :)"
                                                          } else {
                                                            if (in_arr(h, ["unlock_items2", "unlock_items3", "unlock_items4", "unlock_items5", "unlock_items6", "unlock_items7"])) {
                                                              var l = "items2",
                                                                e = 75000000,
                                                                k = 600;
                                                              if (h == "unlock_items3") {
                                                                l = "items3"
                                                              }
                                                              if (h == "unlock_items4") {
                                                                l = "items4", e = 100000000, k = 800
                                                              }
                                                              if (h == "unlock_items5") {
                                                                l = "items5", e = 100000000, k = 800
                                                              }
                                                              if (h == "unlock_items6") {
                                                                l = "items6", e = 112500000, k = 900
                                                              }
                                                              if (h == "unlock_items7") {
                                                                l = "items7", e = 112500000, k = 900
                                                              }
                                                              g += "Hello! You don't seem to have an account open with me. Would you like to open one? It costs " + to_pretty_num(e) + " Gold or " + to_pretty_num(k) + " Shells. We hold onto your items forever.";
                                                              g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='socket.emit(\"bank\",{operation:\"unlock\",gold:1,pack:\"" + l + "\"})' style='margin-right: 5px;'>USE GOLD</div><div class='slimbutton' onclick='socket.emit(\"bank\",{operation:\"unlock\",shells:1,pack:\"" + l + "\"})'>USE SHELLS</div></span>"
                                                            } else {
                                                              return
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  g += "</div>";
  if (f == "return_html") {
    return g
  }
  $("#topleftcornerui").html(g)
}
function load_nearby(g) {
  friends_inside = "nearby";
  var c = "",
    a = false;
  for (var f in entities) {
    var b = entities[f];
    if (!is_player(b)) {
      continue
    }
    a = true
  }
  if (a) {
    c += "<table style='margin: 5px; text-align: center'>";
    c += "<tr style='color: gray; text-decoration: underline'><th style='width: 100px'>Name</th><th style='width: 60px'>Level</th><th style='width: 100px'>Class</th><th style='width: 60px'>Age</th><th style='width: 100px'>Status</th><th style='width: 120px'>Actions</th></tr>";
    for (var f in entities) {
      var b = entities[f],
        d = "AFK",
        e = "";
      if (!is_player(b)) {
        continue
      }
      if (!b.afk) {
        d = "<span style='color: #34bf15'>ACTIVE</span>"
      } else {
        if (b.afk == "code") {
          d = "<span style='color: gray'>CODE</span>"
        } else {
          if (b.afk == "bot") {
            d = "<span style='color: gray'>BOT</span>"
          }
        }
      }
      if (b.owner && in_arr(b.owner, friends)) {
        e += " <span style='color: #EC82C4'>FRIENDS!</span>"
      } else {
        e += " <span style='color: #2799DD' class='clickable' onclick='socket.emit(\"friend\",{event:\"request\",name:\"" + b.name + "\"})'>+FRIEND</span>"
      }
      if (!e) {
        e = "None"
      }
      c += "<tr><td class='clickable' onclick='target_player(\"" + b.name + "\")'>" + b.name + "</td><td>" + b.level + "</td><td>" + b.ctype.toUpperCase() + "</td><td>" + b.age + "</td><td>" + d + "</td><td>" + e + "</td></tr>"
    }
    c += "</table>"
  } else {
    if (g) {
      return load_server_list()
    }
    c = "<div style='margin-top: 8px'>There is no one nearby.</div>"
  }
  $(".friendslist").html(c);
  $(".friendslist").parent().find(".active2").removeClass("active2");
  $(".fnearby").addClass("active2")
}
function load_friends(b) {
  if (b) {
    if (friends_inside != "friends") {
      return
    }
    var a = "";
    if (!b.chars.length) {
      a = "<div style='margin-top: 8px'>No one online.</div>"
    } else {
      a += "<table style='margin: 5px; text-align: center'>";
      a += "<tr style='color: gray; text-decoration: underline'><th style='width: 100px'>Name</th><th style='width: 60px'>Level</th><th style='width: 100px'>Class</th><th style='width: 100px'>Status</th><th style='width: 120px'>Server</th></tr>";
      b.chars.forEach(function(c) {
        var d = "AFK";
        if (!c.afk) {
          d = "<span style='color: #34bf15'>Active</span>"
        }
        a += "<tr><td>" + c.name + "</td><td>" + c.level + "</td><td>" + c.type.toUpperCase() + "</td><td>" + d + "</td><td>" + c.server + "</td></tr>"
      });
      a += "</table>"
    }
    $(".friendslist").html(a)
  } else {
    friends_inside = "friends";
    api_call("pull_friends");
    $(".friendslist").html("");
    $(".friendslist").parent().find(".active2").removeClass("active2");
    $(".ffriends").addClass("active2")
  }
}
function load_server_list(b) {
  if (b) {
    if (friends_inside != "server") {
      return
    }
    var a = "";
    if (!b.length) {
      a = "<div style='margin-top: 8px'>No one discoverable.</div>"
    } else {
      a += "<table style='margin: 5px; text-align: center'>";
      a += "<tr style='color: gray; text-decoration: underline'><th style='width: 100px'>Name</th><th style='width: 60px'>Level</th><th style='width: 100px'>Class</th><th style='width: 60px'>Age</th><th style='width: 100px'>Status</th><th style='width: 120px'>Party</th>";
      if (is_pvp) {
        a += "<th style='width: 120px'>Kills</th>"
      }
      a += "</tr>";
      b.forEach(function(e) {
        var f = "AFK",
          c = e.party,
          d = e.name;
        if (!e.afk) {
          f = "<span style='color: #34bf15'>ACTIVE</span>"
        } else {
          if (e.afk == "code") {
            f = "<span style='color: gray'>CODE</span>"
          } else {
            if (e.afk == "bot") {
              f = "<span style='color: gray'>BOT</span>"
            }
          }
        }
        if (!e.party && e.name != character.name && e.name != "Hidden") {
          c = "<span style='color: #34BCAF' class='clickable' onclick='parent.socket.emit(\"party\",{event:\"invite\",name:\"" + e.name + "\"})'>Invite</span>"
        } else {
          if (e.name == "Hidden") {
            c = "<span style='color: #999999'>None</span>"
          } else {
            if (!e.party) {
              c = "<span style='color: #999999'>You</span>"
            } else {
              c = "<span style='color: #9F68C0'>" + e.party + "</span>"
            }
          }
        }
        if (e.name != character.name && e.name != "Hidden") {
          c += " <span style='color: #A255BA' class='clickable' onclick='hide_modal(); cpm_window(\"" + e.name + "\");'>PM</span>"
        }
        if (d == "Hidden") {
          d = "<span style='color:gray'>Hidden</span>"
        }
        a += "<tr><td>" + d + "</td><td>" + e.level + "</td><td>" + e.type.toUpperCase() + "</td><td>" + e.age + "</td><td>" + f + "</td><td>" + c + "</td>";
        if (is_pvp) {
          a += "<td>" + to_pretty_num(e.kills) + "</td>"
        }
        a += "</tr>"
      });
      a += "</table>"
    }
    $(".friendslist").html(a)
  } else {
    friends_inside = "server";
    socket.emit("players");
    $(".friendslist").html("");
    $(".friendslist").parent().find(".active2").removeClass("active2");
    $(".fserver").addClass("active2")
  }
}
function load_pvp_list(b) {
  console.log(b);
  var a = "<div style='font-size: 24px; text-align: center; padding: 6px; line-height: 24px;'>",
    c = false;
  b.forEach(function(d) {
    a += "<div>" + d[0] + " pwned " + d[1] + "</div>";
    c = true
  });
  if (!c) {
    a += "<div>Noone pwned Anyone</div>"
  }
  a += "</div>";
  show_modal(a, {
    wwidth: 400
  })
}
function load_coming_soon(a) {
  var b = "Coming Sooner!";
  $(".friendslist").parent().find(".active2").removeClass("active2");
  if (a == 1) {
    $(".fserver").addClass("active2")
  } else {
    if (a == 2) {
      $(".fguild").addClass("active2"), b = "Coming Soon!"
    } else {
      if (a == 3) {
        $(".fleaders").addClass("active2"), b = "Planned, along with achievements, character statistics, weekly, monthly leaderboards"
      } else {
        if (a == 4) {
          $(".fmail").addClass("active2"), b = "Coming Soon!"
        }
      }
    }
  }
  $(".friendslist").html("<div style='margin-top: 8px'>" + b + "</div>")
}
var friends_inside = "nearby";

function render_friends() {
  var a = "";
  a += "<div style='text-align: center'>";
  a += "<div class='gamebutton ffriends' onclick='load_friends()'>Friends</div> <div class='gamebutton fnearby' onclick='load_nearby()'>Nearby</div>";
  if (!is_pvp || 1) {
    a += " <div class='gamebutton fserver' onclick='load_server_list();'>Server</div>"
  }
  a += " <div class='gamebutton fguild' onclick='load_coming_soon(2)'>Guild</div> <div class='gamebutton fmail' onclick='load_coming_soon(4)'>Mail</div> <div class='gamebutton fleaders' onclick='load_coming_soon(3)'>Leaderboards</div>";
  a += "<div class='friendslist mt5' style='height: 400px; border: 5px solid gray; font-size: 24px; overflow: scroll; padding: 6px'></div>";
  a += "<div style='font-size: 16px; margin-top: 5px; color: gray; text-align: center'>NOTE: The Communicator is an evolving protoype with missing features</div>";
  a += "</div>";
  show_modal(a, {});
  load_nearby(1)
}
var IID = null;

function precompute_image_positions() {
  if (IID) {
    return
  }
  IID = {};
  for (var a in G.sprites) {
    var e = G.sprites[a];
    if (e.skip) {
      continue
    }
    var c = 4,
      g = "full";
    if (e.type == "animation") {
      c = 1, g = "animation"
    }
    var h = e.matrix;
    var b = e.width || C[e.file] && C[e.file].width || 312,
      k = e.height || C[e.file] && C[e.file].height || 288;
    for (var f = 0; f < h.length; f++) {
      for (var d = 0; d < h[f].length; d++) {
        var a = h[f][d];
        if (!a) {
          continue
        }
        IID[a] = [b, k, d * b / e.columns, f * k / e.rows, b / (e.columns * 3), k / (e.rows * 4), e.file];
        if (G.actual_dimensions[a]) {
          IID[a][2] = IID[a][2] + (G.actual_dimensions[a][2] || 0)
        }
      }
    }
  }
  for (var a in IID) {
    for (var d = 0; d < IID[a].length - 1; d++) {
      IID[a][d] *= 1.5
    }
  }
}
function sprite_image(b, a) {
  try {
    precompute_image_positions();
    if (!a) {
      a = {}
    }
    if (!IID[b]) {
      b = "tf_template"
    }
    return "<div style='display: inline-block; width: 39px; height: 50px; overflow: hidden'><img style='margin-left: " + (-IID[b][2] - IID[b][4] - Math.ceil((IID[b][4] - 39) / 2)) + "px; margin-top: " + (-IID[b][3] - IID[b][5] + 50) + "px; width: " + IID[b][0] + "px; height: " + IID[b][1] + "px;' src='" + IID[b][6] + "'/></div>";
    return "<div style='display: inline-block; width: " + IID[b][4] + "px; height: " + IID[b][5] + "px; overflow: hidden'><img style='margin-left: " + (-IID[b][2] - IID[b][4]) + "px; margin-top: " + (-IID[b][3]) + "px; width: " + IID[b][0] + "px; height: " + IID[b][1] + "px;' src='" + IID[b][6] + "'/></div>"
  } catch (c) {
    console.log(c)
  }
  return ""
}
function load_class_info(a, c) {
  if (!a) {
    a = window.chartype
  }
  if (!c) {
    c = "male"
  }
  var b = "";
  if (window.gendertype) {
    c = gendertype
  }
  if (a == "warrior") {
    if (c == "male") {
      b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-left: -" + (52 * 1) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/custom1.png'/></div>"
    } else {
      b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-top: -" + (72 * 4) + "px; margin-left: -" + (52 * 4) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/chara7.png'/></div>"
    }
    b += "<div><span style='color: white'>Class:</span> <span style='color: " + colors[c] + "'>Warrior</span></div>";
    b += "<div><span style='color: white'>Primary Attribute:</span> <span style='color: " + colors.str + "'>Strength</span></div>";
    b += "<div><span style='color: white'>Description:</span> <span style='color: gray'>Warriors are strong melee characters. Ideal for both PVE and PVP. Can't go wrong with a warrior.</span></div>"
  } else {
    if (a == "mage") {
      if (c == "female") {
        b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='width: 624px; height: 576px; margin-left: -" + (52 * 7) + "px' src='/images/tiles/characters/chara7.png'/></div>"
      } else {
        b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-top: -" + (72 * 4) + "px; margin-left: -" + (52 * 7) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/custom1.png'/></div>"
      }
      b += "<div><span style='color: white'>Class:</span> <span style='color: " + colors[c] + "'>Mage</span></div>";
      b += "<div><span style='color: white'>Primary Attribute:</span> <span style='color: " + colors["int"] + "'>Intelligence</span></div>";
      b += "<div><span style='color: white'>Description:</span> <span style='color: gray'>Mage's are the ideal characters for beginners. They are easy and fun to play. Both PVE and PVP.</span></div>"
    } else {
      if (a == "priest") {
        if (c == "male") {
          b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-top: -" + (72 * 4) + "px; margin-left: -" + (52 * 4) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/chara5.png'/></div>"
        } else {
          b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-left: -" + (52 * 7) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/custom1.png'/></div>"
        }
        b += "<div><span style='color: white'>Class:</span> <span style='color: " + colors[c] + "'>Priest</span></div>";
        b += "<div><span style='color: white'>Primary Attribute:</span> <span style='color: " + colors["int"] + "'>Intelligence</span></div>";
        b += "<div><span style='color: white'>Description:</span> <span style='color: gray'>Priest's are the healers of the realm. They are not ideal for beginners or solo players. They can't inflict a lot of damage. However, thanks to their Curse ability, they might even bring down a strong warrior in PVP. Every serious party needs at least one priest.</span></div>"
      } else {
        if (a == "rogue") {
          if (c == "male") {
            b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-top: -" + (72 * 4) + "px; margin-left: -" + (52 * 7) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/chara6.png'/></div>"
          } else {
            b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-top: -" + (72 * 4) + "px; margin-left: -" + (52 * 7) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/chara3.png'/></div>"
          }
          b += "<div><span style='color: white'>Class:</span> <span style='color: " + colors[c] + "'>Rogue</span></div>";
          b += "<div><span style='color: white'>Primary Attribute:</span> <span style='color: " + colors.dex + "'>Dexterity</span></div>";
          b += "<div><span style='color: white'>Description:</span> <span style='color: gray'>Rogue's are the ideal assassins. Their invis ability makes them super-fun for PVP. They are fast. Not ideal for beginners.</span></div>"
        } else {
          if (a == "ranger") {
            if (c == "male") {
              b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-left: -" + (52 * 4) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/custom1.png'/></div>"
            } else {
              b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-left: -" + (52 * 7) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/chara3.png'/></div>"
            }
            b += "<div><span style='color: white'>Class:</span> <span style='color: " + colors[c] + "'>Ranger</span></div>";
            b += "<div><span style='color: white'>Primary Attribute:</span> <span style='color: " + colors.dex + "'>Dexterity</span></div>";
            b += "<div><span style='color: white'>Description:</span> <span style='color: gray'>Rangers are for the most advanced players. They are mainly archers. Early on they are very weak and hard to play. But a strong ranger can probably rule all other classes. +Work in progress!</span></div>"
          } else {
            if (a == "merchant") {
              if (c == "male") {
                b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-left: -" + (52 * 7) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/npc5.png'/></div>"
              } else {
                b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-left: -" + (52 * 4) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/npc6.png'/></div>"
              }
              b += "<div><span style='color: white'>Class:</span> <span style='color: " + colors[c] + "'>Merchant</span></div>";
              b += "<div><span style='color: white'>Primary Attribute:</span> <span style='color: #804000'>None</span></div>";
              b += "<div><span style='color: white'>Description:</span> <span style='color: gray'>While your main characters are out there adventuring, merchants can wait in town and market your loots. Server and character limits don't apply to merchants. They gain experience when they sell or buy something.</span></div>"
            } else {
              return
            }
          }
        }
      }
    }
  }
  $("#features").css("height", 208).html(b)
};