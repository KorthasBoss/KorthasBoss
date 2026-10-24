/* YEN! // SPECIAL SKILL REGISTRY
   Special skills live in their own files under /skills.
   Ordinary Merchant skills remain generated together in bosses/merchant.js.
*/
window.YEN_SPECIAL_SKILLS = window.YEN_SPECIAL_SKILLS || [];
window.YEN_SKILL_HANDLERS = window.YEN_SKILL_HANDLERS || {};
window.YEN_REGISTER_SKILL = function(skill, handler) {
  if (!skill || !skill.id) return;
  const existing = window.YEN_SPECIAL_SKILLS.findIndex(s => String(s.id) === String(skill.id));
  if (existing >= 0) window.YEN_SPECIAL_SKILLS[existing] = skill;
  else window.YEN_SPECIAL_SKILLS.push(skill);
  if (typeof handler === "function") window.YEN_SKILL_HANDLERS[skill.id] = handler;
};
