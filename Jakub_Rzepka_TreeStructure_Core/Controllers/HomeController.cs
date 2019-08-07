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
        [ValidateAntiForgeryToken]
        public JsonResult AddNewNode(string name, int? parentId)
        {
            if (!string.IsNullOrEmpty(name))
            {
                //todo wywalic VM
                var newNodeId = _nodeRepository.AddNode(new NodeVM
                {
                    Name = name,
                    ParentNodeId = parentId,
                });

                return Json(new { success = true, nodeName = name, newNodeId, nodeParentId = parentId });
            }
            return Json(new { success = true, message = "Name cannot be empty!" });
            
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult DeleteNode(int id)
        {
            _nodeRepository.DeleteNode(id);
            return Json(new { success = true,  nodeId = id });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult EditNode(string name, int id, int? parentId)
        {
            //todo usunac vm
            _nodeRepository.EditNode(new NodeVM
            {
                Id = id,
                Name = name,
                ParentNodeId = parentId
            });
            return Json(new { success = true, nodeId = id });
        }

        public JsonResult SortNode(List<SortVM> sortVm)
        {
            _nodeRepository.SortNode(sortVm);
            return Json(new { success = true});
        }
    }
}
