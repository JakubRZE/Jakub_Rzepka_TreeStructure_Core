using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Jakub_Rzepka_TreeStructure_Core.Models;
using Jakub_Rzepka_TreeStructure_Core.Repositories;
using Jakub_Rzepka_TreeStructure_Core.ViewModels;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Authorization;

namespace Jakub_Rzepka_TreeStructure_Core.Controllers
{
    public class HomeController : Controller
    {
        private readonly INodeRepository _nodeRepository;

        public HomeController(INodeRepository nodeRepository)
        {
            _nodeRepository = nodeRepository;
        }



        public IActionResult Index()
        {
            return View();
        }

        public JsonResult GetNodes()
        {
            var nodes = _nodeRepository.GetAllNodes();
            return Json(nodes);
        }

        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public JsonResult AddNewNode(NodeVM nodeVm)
        {
            if (!string.IsNullOrEmpty(nodeVm.Name))
            {
                var newNodeId = _nodeRepository.AddNode(nodeVm);
                return Json(new { success = true, nodeName = nodeVm.Name, newNodeId, nodeParentId = nodeVm.ParentNodeId });
            }
            return Json(new { success = true, message = "Name cannot be empty!" });
            
        }

        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public JsonResult DeleteNode(int id)
        {
            _nodeRepository.DeleteNode(id);
            return Json(new { success = true,  nodeId = id });
        }

        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public JsonResult EditNode(NodeVM nodeVm)
        {
            _nodeRepository.EditNode(nodeVm);
            return Json(new { success = true, nodeId = nodeVm.Id });
        }

        [HttpPost]
        [Authorize]
        public JsonResult SortNode(List<SortVM> sortVm)
        {
            _nodeRepository.SortNode(sortVm);
            return Json(new { success = true});
        }
    }
}
